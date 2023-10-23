import { useEffect } from "react";
import { Button, Drawer } from "rsuite";
import "rsuite/dist/rsuite.min.css";
import Table from "../../components/Table";
import moment from "moment";

import { useDispatch, useSelector } from "react-redux";
import {
  allCustomers,
  updateCustomer,
  filterCustomers,
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
          <div className="form-group mb-3">
            <b>E-mail</b>
            <div className="input-group">
              <input
                type="email"
                className="form-control"
                placeholder="E-mail do cliente"
                value={customer.email}
                onChange={(e) => setCustomer("email", e.target.value)}
              />
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
            </div>
          </div>
        </Drawer.Body>
      </Drawer>
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
                  customer.gender === "M" ? "Masculino" : "Feminino",
                width: 200,
              },
              {
                label: "Data Cadastro",
                content: (customer) =>
                  moment(customer.dateRegister).format("DD/MM/YYYY"),
                width: 200,
              },
            ]}
          />
        </div>
      </div>
    </div>
  );
};

export default Customers;
