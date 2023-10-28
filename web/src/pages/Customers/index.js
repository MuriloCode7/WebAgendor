import { useEffect } from "react";
import { Button, Drawer, Modal, IconButton } from "rsuite";
import "rsuite/dist/rsuite.min.css";
import Table from "../../components/Table";
import moment from "moment";

import { useDispatch, useSelector } from "react-redux";
import {
  allCustomers,
  updateCustomer,
  filterCustomers,
  addCustomer,
  unlinkCustomer,
  resetCustomer,
} from "../../store/modules/customer/actions";

const Customers = () => {
  const dispatch = useDispatch();
  const { customers, behavior, customer, form, components } = useSelector(
    (state) => state.customer
  );

  const setComponent = (component, state) => {
    dispatch(
      updateCustomer({
        components: { ...components, [component]: state },
      })
    );
  };

  const setCustomer = (key, value) => {
    dispatch(
      updateCustomer({
        customer: { ...customer, [key]: value },
      })
    );
  };

  const save = () => {
    dispatch(addCustomer());
  };

  const remove = () => {
    dispatch(unlinkCustomer());
  };

  useEffect(() => {
    dispatch(allCustomers());
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
            {behavior === "create"
              ? "Cadastrar novo cliente"
              : "Atualizar dados do cliente"}
          </h3>
          <div className="row mt-3">
            <div className="form-group col-12 mb-3">
              <b>E-mail</b>
              <div className="input-group">
                <input
                  type="email"
                  disabled={behavior === "update"}
                  className="form-control"
                  placeholder="E-mail do cliente"
                  value={customer.email}
                  onChange={(e) => setCustomer("email", e.target.value)}
                />
                {behavior === "create" && (
                  <div className="input-group-append">
                    <Button
                      appearance="primary"
                      loading={form.filtering}
                      disabled={form.filtering}
                      onClick={() => dispatch(filterCustomers())}
                    >
                      Pesquisar
                    </Button>
                  </div>
                )}
              </div>
            </div>
            <div className="form-group col-6 mb-3">
              <b className="">Nome</b>
              <input
                type="text"
                className="form-control"
                placeholder="Nome do cliente"
                disabled={form.disabled}
                value={customer.name}
                onChange={(e) => setCustomer("name", e.target.value)}
              />
            </div>
            <div className="form-group col-6 mb-3">
              <b className="">Telefone / Whatsapp</b>
              <input
                type="text"
                className="form-control"
                placeholder="+5562988887777"
                disabled={form.disabled}
                value={customer.phone}
                onChange={(e) => setCustomer("phone", e.target.value)}
              />
            </div>
            <div className="form-group col-6 mb-3">
              <b className="">Data de nascimento</b>
              <input
                type="date"
                className="form-control"
                disabled={form.disabled}
                value={customer.dateBirth}
                onChange={(e) => setCustomer("dateBirth", e.target.value)}
              />
            </div>
            <div className="form-group col-6 mb-3">
              <b>Sexo</b>
              <select
                disabled={form.disabled}
                className="form-control"
                value={customer.gender}
                onChange={(e) => setCustomer("gender", e.target.value)}
              >
                <option value="M">Masculino</option>
                <option value="F">Feminino</option>
                <option value="O">Outro</option>
              </select>
            </div>
            <div className="form-group col-6 mb-3">
              <b>Tipo de documento</b>
              <select
                disabled={form.disabled}
                className="form-control"
                value={customer.document.type}
                onChange={(e) =>
                  setCustomer("document", {
                    ...customer.document,
                    type: e.target.value,
                  })
                }
              >
                <option value="cpf">CPF</option>
                <option value="cnpj">CNPJ</option>
              </select>
            </div>
            <div className="form-group col-6 mb-3">
              <b>Número do documento</b>
              <input
                type="text"
                disabled={form.disabled}
                className="form-control"
                value={customer.document.number}
                onChange={(e) =>
                  setCustomer("document", {
                    ...customer.document,
                    number: e.target.value,
                  })
                }
              />
            </div>
            <div className="form-group col-3 mb-3">
              <b>CEP</b>
              <input
                type="text"
                className="form-control"
                placeholder="Digite o CEP"
                disabled={form.disabled}
                value={customer.address.cep}
                onChange={(e) =>
                  setCustomer("address", {
                    ...customer.address,
                    cep: e.target.value,
                  })
                }
              />
            </div>
            <div className="form-group col-6 mb-3">
              <b>Rua / Logradouro</b>
              <input
                type="text"
                className="form-control"
                placeholder="Rua / Logradouro"
                disabled={form.disabled}
                value={customer.address.street}
                onChange={(e) =>
                  setCustomer("address", {
                    ...customer.address,
                    street: e.target.value,
                  })
                }
              />
            </div>
            <div className="form-group col-3 mb-3">
              <b>Número</b>
              <input
                type="text"
                className="form-control"
                placeholder="Número"
                disabled={form.disabled}
                value={customer.address.number}
                onChange={(e) =>
                  setCustomer("address", {
                    ...customer.address,
                    number: e.target.value,
                  })
                }
              />
            </div>
            <div className="form-group col-3 mb-3">
              <b>UF</b>
              <input
                type="text"
                className="form-control"
                placeholder="UF"
                disabled={form.disabled}
                value={customer.address.uf}
                onChange={(e) =>
                  setCustomer("address", {
                    ...customer.address,
                    uf: e.target.value,
                  })
                }
              />
            </div>
            <div className="form-group col-9 mb-3">
              <b>Cidade</b>
              <input
                type="text"
                className="form-control"
                placeholder="Cidade"
                disabled={form.disabled}
                value={customer.address.city}
                onChange={(e) =>
                  setCustomer("address", {
                    ...customer.address,
                    city: e.target.value,
                  })
                }
              />
            </div>
          </div>
          <Button
            block
            className="mt-3"
            color={behavior === "create" ? "green" : "red"}
            appearance="primary"
            size="lg"
            loading={form.saving}
            onClick={() => {
              if (behavior === "create") {
                save();
              } else {
                setComponent("confirmDelete", true);
              }
            }}
          >
            {behavior === "create" ? "Salvar" : "Remover"} cliente
          </Button>
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
            <h2 className="mb-4 mt-0">Clientes</h2>
            <div>
              <button
                className="btn btn-primary btn-lg"
                onClick={() => {
                  dispatch(
                    updateCustomer({
                      behavior: "create",
                    })
                  );
                  dispatch(resetCustomer());
                  setComponent("drawer", true);
                }}
              >
                <span className="mdi mdi-plus">Novo cliente</span>
              </button>
            </div>
          </div>
          <Table
            loading={form.filtering}
            data={customers}
            action="Ver informações"
            config={[
              { label: "Nome", key: "name", width: 200, fixed: true },
              { label: "E-mail", key: "email", width: 200 },
              { label: "Telefone", key: "phone", width: 200 },
              {
                label: "Sexo",
                content: (customer) =>
                  customer.gender === "M"
                    ? "Masculino"
                    : customer.gender === "F"
                    ? "Feminino"
                    : "Outros",
                width: 200,
              },
              {
                label: "Data Cadastro",
                content: (customer) =>
                  moment(customer.dateRegister).format("DD/MM/YYYY"),
                width: 200,
              },
            ]}
            onRowClick={(customer) => {
              dispatch(
                updateCustomer({
                  behavior: "update",
                })
              );
              dispatch(
                updateCustomer({
                  customer,
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

export default Customers;
