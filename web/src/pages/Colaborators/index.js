import { useEffect } from "react";
import { Button, Drawer, Modal, IconButton } from "rsuite";
import "rsuite/dist/rsuite.min.css";
import Table from "../../components/Table";
import moment from "moment";

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
  const { colaborators, behavior, colaborator, form, components } = useSelector(
    (state) => state.colaborator
  );

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

  const save = () => {
    dispatch(addColaborator());
  };

  const remove = () => {
    dispatch(unlinkColaborator());
  };

  useEffect(() => {
    dispatch(allColaborators());
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
            <div className="form-group col-6">
              <b>Nome</b>
              <input
                type="text"
                className="form-control"
                disabled={form.disabled}
                placeholder="Nome do colaborador"
                value={colaborator.name}
                onChange={(e) => setColaborator('name', e.target.value)} 
              />
            </div>
            <div className="form-group col-6">
              <b>Status</b>
              <select
                className="form-control"
                disabled={form.disabled && behavior === 'create'}
                value={colaborator.bond}
                onChange={(e) => setColaborator('bond', e.target.value)}
              >
                <option value="A">Ativo</option>
                <option value="I">Inativo</option>
              </select>
            </div>
            <div className="form-group col-4">
              <b>Telefone / Whatsapp</b>
              <input
                type="text"
                className="form-control"
                disabled={form.disabled}
                placeholder="Nome do colaborador"
                value={colaborator.name}
                onChange={(e) => setColaborator('name', e.target.value)} 
              />
            </div>
          </div>
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
