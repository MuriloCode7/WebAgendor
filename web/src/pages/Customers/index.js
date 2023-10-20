import { useEffect } from "react";
import { Button } from "rsuite";
import "rsuite/dist/rsuite.min.css";
import Table from "../../components/Table";
import moment from "moment";

import { useDispatch, useSelector } from "react-redux";
import { allCustomers } from "../../store/modules/customer/actions";

const Customers = () => {
  const dispatch = useDispatch;
  const { customers } = useSelector((state) => state.customers);

  useEffect(() => {
    dispatch(allCustomers());
  });

  return (
    <div className="col p-5 overflow-auto h-100">
      <div className="row">
        <div className="col-12">
          <div className="w-100 d-flex justify-content-between">
            <h2 className="mb-4 mt-0">Clientes</h2>
            <div>
              <button className="btn btn-primary btn-lg">
                <span className="mdi mdi-plus">Novo cliente</span>
              </button>
            </div>
          </div>
          <Table
            data={customers}
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
            actions={(customer) => (
              <Button color="blue" size="xs">
                Ver informações
              </Button>
            )}
          />
        </div>
      </div>
    </div>
  );
};

export default Customers;
