import { useEffect } from "react";
import { Button, Drawer, Modal, Tag, DatePicker, Uploader } from "rsuite";
import "rsuite/dist/rsuite.min.css";
import Table from "../../components/Table";
import moment from "moment";
import consts from "../../consts";

import { useDispatch, useSelector } from "react-redux";
import {
  allSpecialties,
  updateSpecialty,
  addSpecialty,
  removeSpecialty,
  removeFile,
  resetSpecialty,
} from "../../store/modules/specialty/actions";

const Specialties = () => {
  const dispatch = useDispatch();
  const { specialties, behavior, specialty, form, components } = useSelector(
    (state) => state.specialty
  );

  const setComponent = (component, state) => {
    dispatch(
      updateSpecialty({
        components: { ...components, [component]: state },
      })
    );
  };

  const setSpecialty = (key, value) => {
    dispatch(
      updateSpecialty({
        specialty: { ...specialty, [key]: value },
      })
    );
  };

  const save = () => {
    dispatch(addSpecialty());
  };

  const remove = () => {
    dispatch(removeSpecialty());
  };

  useEffect(() => {
    dispatch(allSpecialties());
  }, []);

  return (
    <div className="col p-5 overflow-auto h-100">
      <Drawer
        open={components.drawer}
        size="sm"
        onClose={() => setComponent("drawer", false)}
      >
        <Drawer.Body>
          <h3>{behavior === "create" ? "Criar novo" : "Atualizar"} serviço</h3>
          <div className="row mt-3">
            <div className="form-group col-6 mb-3">
              <b>Título</b>
              <input
                className="form-control"
                type="text"
                placeholder="Título do serviço"
                value={specialty.title}
                onChange={(e) => {
                  setSpecialty("title", e.target.value);
                }}
              />
            </div>
            <div className="form-group col-3 mb-3">
              <b>R$ Preço</b>
              <input
                className="form-control"
                type="number"
                placeholder="Preço do serviço"
                value={specialty.price}
                onChange={(e) => {
                  setSpecialty("price", e.target.value);
                }}
              />
            </div>
            <div className="form-group col-3 mb-3">
              <b>Recor. (dias)</b>
              <input
                className="form-control"
                type="number"
                placeholder="Recorrência do serviço"
                value={specialty.recurrence}
                onChange={(e) => {
                  setSpecialty("recurrence", e.target.value);
                }}
              />
            </div>
            <div className="form-group col-3 mb-3">
              <b>% Comissão</b>
              <input
                className="form-control"
                type="number"
                placeholder="Comissão do serviço"
                value={specialty.commission}
                onChange={(e) => {
                  setSpecialty("commission", e.target.value);
                }}
              />
            </div>
            <div className="form-group col-4 mb-3">
              <b className="d-block">Duração</b>
              <DatePicker
                block
                format="HH:mm"
                value={new Date(specialty.duration)}
                // Aqui é definido para aparecer somente os minutos 0 e 30
                hideMinutes={(min) => ![0, 30].includes(min)}
                onChange={(e) => {
                  setSpecialty("duration", e);
                }}
              />
            </div>
            <div className="form-group col-4 mb-3">
              <b>Status</b>
              <select
                className="form-control"
                value={specialty.status}
                onChange={(e) => setSpecialty("status", e.target.value)}
              >
                <option value="A">Ativo</option>
                <option value="I">Inativo</option>
              </select>
            </div>
            <div className="form-group col-12 mb-3">
              <b>Descrição</b>
              <textarea
                rows="5"
                className="form-control"
                placeholder="Descrição do serviço..."
                value={specialty.description}
                onChange={(e) => setSpecialty("description", e.target.value)}
              ></textarea>
            </div>
            <div className="form-group col-12 mb-3">
              <b className="d-block">
                Imagens do serviço {"(DESABILITADO PARA CORREÇÃO NO UPLOAD)"}
              </b>
              <Uploader
                multiple
                autoUpload={false}
                disabled={true}
                listType="picture"
                defaultFileList={specialty.files.map((specialty, index) => ({
                  name: "specialty?.path",
                  fileKey: index,
                  url: `${consts.bucketUrl}/${specialty?.path}`,
                }))}
                onChange={(files) => {
                  const newFiles = files
                    .filter((f) => f.blobFile)
                    .map((f) => f.blobFile);

                  setSpecialty("files", newFiles);
                }}
                onRemove={(file) => {
                  if (behavior === "update" && file.url) {
                    dispatch(removeFile(file.name));
                  }
                }}
              >
                <button>
                  <span
                    className="mdi mdi-camera-plus"
                    style={{ fontSize: 40 }}
                  />
                </button>
              </Uploader>
            </div>
          </div>

          <Button
            loading={form.saving}
            color={behavior === "create" ? "green" : "primary"}
            appearance="primary"
            size="lg"
            block
            onClick={() => save()}
            className="mt-3"
          >
            {behavior === "create" ? "Salvar" : "Atualizar"} serviço
          </Button>
          {behavior === "update" && (
            <Button
              loading={form.saving}
              appearance="primary"
              color="red"
              size="lg"
              block
              onClick={() => setComponent("confirmDelete", true)}
              className="mt-1"
            >
              Remover serviço
            </Button>
          )}
        </Drawer.Body>
      </Drawer>
      <Modal open={components.confirmDelete} size="xs">
        <Modal.Body>
          <div className="w-100 d-flex justify-content">
            <span className="mdi mdi-alert" style={{ fontSize: 40 }} />
            Tem certeza que deseja excluir?
            <br></br>Essa ação será irreversível!
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            loading={form.saving}
            onClick={() => remove()}
            color="red"
            appearance="primary"
          >
            Sim, tenho certeza!
          </Button>
          <Button
            onClick={() => setComponent("confirmDelete", false)}
            appearance="subtle"
          >
            Cancelar
          </Button>
        </Modal.Footer>
      </Modal>
      <div className="row">
        <div className="col-12">
          <div className="w-100 d-flex justify-content-between">
            <h2 className="mb-4 mt-0">Serviços</h2>
            <div>
              <button
                className="btn btn-primary btn-lg"
                onClick={() => {
                  dispatch(
                    updateSpecialty({
                      behavior: "create",
                    })
                  );
                  dispatch(resetSpecialty());
                  setComponent("drawer", true);
                }}
              >
                <span className="mdi mdi-plus">Novo serviço</span>
              </button>
            </div>
          </div>
          <Table
            loading={form.filtering}
            data={specialties}
            action="Ver informações"
            config={[
              {
                label: "Título",
                key: "title",
                sortable: true,
                fixed: true,
                width: 200,
              },
              {
                label: "R$ Preço",
                key: "price",
                content: (specialty) => `R$ ${specialty.price.toFixed(2)}`,
                sortable: true,
              },
              {
                label: "% Comissão",
                key: "commission",
                content: (specialty) => `${specialty.commission}%`,
                sortable: true,
              },
              {
                label: "Recorrência (Dias)",
                key: "recurrence",
                content: (specialty) => `${specialty.recurrence} dias`,
              },
              {
                label: "Duração",
                key: "duration",
                content: (specialty) =>
                  moment(specialty.duration).format("HH:mm"),
                sortable: true,
              },
              {
                label: "Status",
                key: "status",
                content: (specialty) => (
                  <Tag color={specialty.status === "A" ? "green" : "red"}>
                    {specialty.status === "A" ? "Ativo" : "Inativo"}
                  </Tag>
                ),
                sortable: true,
              },
            ]}
            onRowClick={(specialty) => {
              dispatch(
                updateSpecialty({
                  behavior: "update",
                })
              );
              dispatch(
                updateSpecialty({
                  specialty,
                })
              );
              setComponent("drawer", true);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Specialties;
