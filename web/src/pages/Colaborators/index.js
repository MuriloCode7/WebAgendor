import { useEffect } from "react";
import {
  Button,
  Drawer,
  Modal,
  IconButton,
  TagPicker,
  SelectPicker,
} from "rsuite";
import "rsuite/dist/rsuite.min.css";
import Table from "../../components/Table";
import moment from "moment";
import banks from "../../data/banks.json";

import { useDispatch, useSelector } from "react-redux";
import {
  allColaborators,
  updateColaborator,
  filterColaborators,
  addColaborator,
  unlinkColaborator,
  allSpecialties,
} from "../../store/modules/colaborator/actions";

const Colaborators = () => {
  const dispatch = useDispatch();
  const { colaborators, behavior, colaborator, form, components, specialties } =
    useSelector((state) => state.colaborator);

  const setComponent = (component, state) => {
    dispatch(
      updateColaborator({
        components: { ...components, [component]: state },
      })
    );
  };

  const setColaborator = (key, value) => {
    dispatch(
      updateColaborator({
        colaborator: { ...colaborator, [key]: value },
      })
    );
  };

  const setBankAccount = (key, value) => {
    dispatch(
      updateColaborator({
        colaborator: {
          ...colaborator,
          bankAccount: {
            ...colaborator.bankAccount,
            [key]: value,
          },
        },
      })
    );
  };

  const save = () => {
    dispatch(addColaborator());
  };

  const remove = () => {
    dispatch(unlinkColaborator());
  };

  useEffect(() => {
    dispatch(allColaborators());
    dispatch(allSpecialties());
  }, []);

  return (
    <div className="col p-5 overflow-auto h-100">
      <Drawer
        open={components.drawer}
        size="sm"
        onHide={() => setComponent("drawer", false)}
        onClose={() => setComponent("drawer", false)}
      >
        <Drawer.Body>
          <h3>
            {behavior === "create" ? "Cadastrar novo" : "Atualizar"} colaborador
          </h3>
          <div className="row mt-3">
            <div className="form-group col-12">
              <b>E-mail</b>
              <div className="input-group mb-3">
                <input
                  disabled={behavior === "update"}
                  type="email"
                  className="form-control"
                  placeholder="E-mail do colaborador"
                  value={colaborator.email}
                  onChange={(e) => setColaborator("email", e.target.value)}
                />
                {behavior === "create" && (
                  <div class="input-group-append">
                    <Button
                      appearance="primary"
                      loading={form.filtering}
                      disabled={form.filtering}
                      onClick={() => {
                        dispatch(filterColaborators());
                      }}
                    >
                      Pesquisar
                    </Button>
                  </div>
                )}
              </div>
            </div>
            <div className="form-group col-6 mb-3">
              <b>Nome</b>
              <input
                type="text"
                className="form-control"
                disabled={form.disabled}
                placeholder="Nome do colaborador"
                value={colaborator.name}
                onChange={(e) => setColaborator("name", e.target.value)}
              />
            </div>
            <div className="form-group col-6 mb-3">
              <b>Status</b>
              <select
                className="form-control"
                disabled={form.disabled && behavior === "create"}
                value={colaborator.bond}
                onChange={(e) => setColaborator("bond", e.target.value)}
              >
                <option value="A">Ativo</option>
                <option value="I">Inativo</option>
              </select>
            </div>
            <div className="form-group col-4 mb-3">
              <b>Telefone / Whatsapp</b>
              <input
                type="text"
                className="form-control"
                disabled={form.disabled}
                placeholder="Telefone / Whatsapp do colaborador"
                value={colaborator.phone}
                onChange={(e) => setColaborator("phone", e.target.value)}
              />
            </div>
            <div className="form-group col-4 mb-3">
              <b>Data de nascimento</b>
              <input
                type="date"
                className="form-control"
                disabled={form.disabled}
                placeholder="Data de nascimento do colaborador"
                value={colaborator.dateBirth}
                onChange={(e) => setColaborator("dateBirth", e.target.value)}
              />
            </div>
            <div className="form-group col-4 mb-3">
              <b>Sexo</b>
              <select
                className="form-control"
                disabled={form.disabled}
                value={colaborator.gender}
                onChange={(e) => setColaborator("gender", e.target.value)}
              >
                <option value="M">Masculino</option>
                <option value="F">Feminino</option>
                <option value="O">Outro</option>
              </select>
            </div>
            {/* Especialidades */}
            <div className="col-12 mb-3">
              <b>Especialidades</b>
              <TagPicker
                size="lg"
                block
                data={specialties}
                disabled={form.disabled && behavior === "create"}
                value={colaborator.specialties}
                onChange={(specialty) =>
                  setColaborator("specialties", specialty)
                }
              />
            </div>

            {/* Dados da conta bancaria */}
            <div className="row">
              <h4 className="mb-3">Dados da conta bancária</h4>
              {/* Titular */}
              <div className="form-group col-6 mb-3">
                <b>Titular da conta</b>
                <input
                  type="text"
                  className="form-control"
                  disabled={form.disabled}
                  placeholder="Nome do titular da conta"
                  value={colaborator.bankAccount.holder}
                  onChange={(e) => setBankAccount("holder", e.target.value)}
                />
              </div>
              {/* CPF/CNPJ */}
              <div className="form-group col-6 mb-3">
                <b>CPF/CNPJ</b>
                <input
                  type="text"
                  className="form-control"
                  disabled={form.disabled}
                  placeholder="CPF/CNPJ do titular"
                  value={colaborator.bankAccount.cpfCnpj}
                  onChange={(e) => setBankAccount("cpfCnpj", e.target.value)}
                />
              </div>
              {/* Banco */}
              <div className="form-group col-6 mb-3">
                <b>Banco</b>
                <SelectPicker
                  disabled={form.disabled}
                  value={colaborator.bankAccount.bank}
                  onChange={(bank) => setBankAccount("bank", bank)}
                  block
                  size="lg"
                  data={banks}
                />
              </div>
              {/* Tipo de conta */}
              <div className="form-group col-6 mb-3">
                <b>Tipo de conta</b>
                <select
                  className="form-control"
                  disabled={form.disabled}
                  value={colaborator.bankAccount.type}
                  onChange={(e) => setBankAccount("type", e.target.value)}
                >
                  <option value="CC">Conta corrente</option>
                  <option value="CP">Conta poupança</option>
                </select>
              </div>
              {/* Agência */}
              <div className="form-group col-6 mb-3">
                <b>Agência</b>
                <input
                  type="text"
                  className="form-control"
                  disabled={form.disabled}
                  placeholder="Agência"
                  value={colaborator.bankAccount.agency}
                  onChange={(e) => setBankAccount("agency", e.target.value)}
                />
              </div>
              {/* Numero da conta */}
              <div className="form-group col-4 mb-3">
                <b>Número da conta</b>
                <input
                  type="text"
                  className="form-control"
                  disabled={form.disabled}
                  placeholder="Número da conta"
                  value={colaborator.bankAccount.number}
                  onChange={(e) => setBankAccount("number", e.target.value)}
                />
              </div>
              {/* Dígito verificador */}
              <div className="form-group col-2 mb-3">
                <b>Dígito</b>
                <input
                  type="text"
                  className="form-control"
                  disabled={form.disabled}
                  placeholder="DV"
                  value={colaborator.bankAccount.dv}
                  onChange={(e) => setBankAccount("dv", e.target.value)}
                />
              </div>
            </div>
          </div>
          <Button
            loading={form.saving}
            appearance="primary"
            color={behavior === 'create' ? 'green' : 'primary'}
            size="lg"
            block
            onClick={() => save()}
            className="mt-3"
          >
            {behavior === 'create' ? 'Salvar' : 'Atualizar'} colaborador
          </Button>
          {behavior === 'update' && (
            <Button
              appearance="primary"
              loading={form.saving}
              color="red"
              size="lg"
              block
              onClick={() => setComponent('confirmDelete', true)}
              className="mt-1"
            >
              Remover colaborador
            </Button>
          )}
        </Drawer.Body>
      </Drawer>

      <Modal
        open={components.confirmDelete}
        onHide={() => setComponent("confirmDelete", false)}
        size="xs"
      >
        <Modal.Body>
          <IconButton
            icon="remind"
            style={{
              color: "#ffb300",
              fontSize: 24,
            }}
          />
          {"  "} <br></br>Tem certeza que deseja excluir? <br></br>Essa ação
          será irreversível!
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
            <h2 className="mb-4 mt-0">Colaboradores</h2>
            <div>
              <button
                className="btn btn-primary btn-lg"
                onClick={() => {
                  dispatch(
                    updateColaborator({
                      behavior: "create",
                    })
                  );
                  setComponent("drawer", true);
                }}
              >
                <span className="mdi mdi-plus">Novo colaborador</span>
              </button>
            </div>
          </div>
          <Table
            loading={form.filtering}
            data={colaborators}
            action="Ver informações"
            config={[
              { label: "Nome", key: "name", width: 200, fixed: true },
              { label: "E-mail", key: "email", width: 200 },
              { label: "Telefone", key: "phone", width: 200 },
              {
                label: "Sexo",
                content: (colaborator) =>
                  colaborator.gender === "M"
                    ? "Masculino"
                    : colaborator.gender === "F"
                    ? "Feminino"
                    : "Outros",
                width: 200,
              },
              {
                label: "Data Cadastro",
                content: (colaborator) =>
                  moment(colaborator.dateRegister).format("DD/MM/YYYY"),
                width: 200,
              },
            ]}
            onRowClick={(colaborator) => {
              dispatch(
                updateColaborator({
                  behavior: "update",
                })
              );
              dispatch(
                updateColaborator({
                  colaborator,
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

export default Colaborators;
