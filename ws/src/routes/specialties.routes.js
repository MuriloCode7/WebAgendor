const express = require('express');
const router = express.Router();
const Busboy = require('busboy');
const aws = require('../services/aws');
const Specialty = require('../models/Specialty');
const File = require('../models/File');

/** Rota de criacao de um specialty com upload das fotos do servico
 * (opcional)
 */
router.post('/', async (req, res) => {
  /** Aqui passamos toda a informação da requisição para o busboy lidar quando um
   * upload é iniciado e quando termina
   */
  let busboy = Busboy({ headers: req.headers });
  /**Quando o busboy tiver finalizado o processamento, será executado o upload de fato,
   * aqui ele vai garantir que os arquivos já estejam disponiveis
   */
  busboy.on('finish', async () => {
    try {
      const { companyId, specialty } = req.body;
      let errors = [];
      let files = [];

      /**Se existe arquivos na requisição */
      if (req.files && Object.keys(req.files).length > 0) {
        /**Pega cada um dos arquivos pela chave */
        for (let key of Object.keys(req.files)) {
          const file = req.files[key];

          /**Separa o nome do arquivo da extensao */
          const nameParts = file.name.split('.');
          /**Define o nome do arquivo com o timestamp atual para nao haver dupliciidade
           * no bd
           */
          const fileName = `${new Date().getTime()}.${
            nameParts[nameParts.length - 1]
          }`;

          const path = `specialties/${companyId}/${fileName}`;
          
          files.push(path); // remover essa linha apos atualizacao

          // Descomentar apos atualizar aws para versao 3
          // const response = await aws.uploadToS3(file, path);

          // if (response.error) {
          //   errors.push({ error: true, message: response.message });
          // } else {
          //   files.push(path);
          // }
        }
      }

      /**Se ocorreu serao exibidos um por um */
      if (errors.length > 0) {
        res.json(errors[0]);
        return false;
      }

      // Criar specialty
      let jsonSpecialty = JSON.parse(specialty);
      const specialtyRegistered = await new Specialty(jsonSpecialty).save();

      // Criar arquivo
      files = files.map(file => ({
        referenceId: specialtyRegistered._id,
        model: 'specialty',
        path: file,
      }));

      await File.insertMany(files);

      res.json({ specialty: specialtyRegistered, files });
    } catch (err) {
      res.json({ error: true, message: err.message });
    }
  });
  req.pipe(busboy);
});

/**Rota de alteracao de um specialty pelo id */
router.put('/:id', async (req, res) => {
  /** Aqui passamos toda a informação da requisição para o busboy lidar quando um
   * upload é iniciado e quando termina
   */
  let busboy = new Busboy({ headers: req.headers });
  /**Quando o busboy tiver finalizado o processamento, será executado o upload de fato,
   * aqui ele vai garantir que os arquivos já estejam disponiveis
   */
  busboy.on('finish', async () => {
    try {
      const { companyId, specialty } = req.body;
      let errors = [];
      let files = [];

      /**Se existe arquivos na requisição */
      if (req.files && Object.keys(req.files).length > 0) {
        /**Pega cada um dos arquivos pela chave */
        for (let key of Object.keys(req.files)) {
          const file = req.files[key];

          /**Separa o nome do arquivo da extensao */
          const nameParts = file.name.split('.');
          /**Define o nome do arquivo com o timestamp atual para nao haver dupliciidade
           * no bd
           */
          const fileName = `${new Date().getTime()}.${
            nameParts[nameParts.length - 1]
          }`;

          const path = `specialties/${companyId}/${fileName}`;

          const response = await aws.uploadToS3(file, path);

          if (response.error) {
            errors.push({ error: true, message: response.message });
          } else {
            files.push(path);
          }
        }
      }

      /**Se ocorreu serao exibidos um por um */
      if (errors.length > 0) {
        res.json(errors[0]);
        return false;
      }

      // Criar specialty
      const jsonSpecialty = JSON.parse(specialty);
      await Specialty.findByIdAndUpdate(req.params.id, jsonSpecialty);

      // Criar arquivo
      files = files.map(file => ({
        referenceId: req.params.id,
        model: 'specialty',
        path: file,
      }));

      await File.insertMany(files);

      res.json({ error: false });
    } catch (err) {
      res.json({ error: true, message: err.message });
    }
  });
  req.pipe(busboy);
});

/* Rota para listar todos servicos de uma empresa */
router.get('/company/:companyId', async (req, res) => {
  try {
    let specialtiesCompany = [];

    const specialties = await Specialty.find({
      companyId: req.params.companyId,
      //$ne significa not equal
      status: { $ne: 'E'},
    });

    for(let specialty of specialties){
      const files = await File.find({
        model: 'specialty',
        referenceId: specialty._id
      });
      specialtiesCompany.push({...specialty._doc, files});
    }

    res.json({
      specialties: specialtiesCompany,
    });

    res.json({});
  } catch (err) {
    res.json({ error: true, message: err.message });
  }
});

/** Rota para deletar um arquivo da specialty */
router.post('/remove-file', async (req, res) => {
  try { 
    const { id } = req.body;

    /**Excluindo da aws */
    //await aws.deleteFileS3(id);

    await File.findOneAndDelete({
      path: id,
    });

    res.json({error: false});

  } catch(err){
    res.json({error: true, message: err.message});
  }
});

// Rota para deletar servico
router.delete('/:id', async (req, res) => {

  const { id } = req.params;

  try {
    /** Por vies de manutenção dos registros, a especialidade nao é de fato excluida do
     * sistema, apenas inativada
     */
    await Specialty.findByIdAndUpdate(id, {status: 'E'});
    res.json({error: false});
  } catch (err){
    res.json({error: true, message: err.message});
  }
});

module.exports = router;