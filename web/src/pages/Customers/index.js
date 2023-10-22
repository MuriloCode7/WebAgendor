import { useEffect } from "react";
import { Button, Drawer } from "rsuite";
import "rsuite/dist/rsuite.min.css";
import Table from "../../components/Table";
import moment from "moment";

import { useDispatch, useSelector } from "react-redux";
import {
  allCustomers,
  updateCustomer,
} from "../../store/modules/customer/actions";

const Customers = () => {
  const dispatch = useDispatch();
  const { customers, form, components } = useSelector(
    (state) => state.customer
  );

  const setComponent = (component, state) => {
    dispatch(
      updateCustomer({
        components: { ...components, [component]: state },
      })
    );
  };

  useEffect(() => {
    dispatch(allCustomers());
  }, []);

  return (
    <div className="col p-5 overflow-auto h-100">
      <Drawer
        show={components.drawer}
        size="sm"
        onHide={() => setComponent("drawer", false)}
      >
        <Drawer.Body></Drawer.Body>
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
            action='Ver informações'
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
