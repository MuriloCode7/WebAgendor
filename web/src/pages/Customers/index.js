import { Table } from "rsuite";
import 'rsuite/dist/rsuite.min.css';
const { Column, HeaderCell, Cell, Pagination } = Table;

const Customers = () => {
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
            height={400}
            data={[]}
            onRowClick={(data) => {
              console.log(data);
            }}
          >
            <Column width={70} align="center"fixed>
              <HeaderCell>Id</HeaderCell>
              <Cell dataKey="id"/>
            </Column>

            <Column width={200} fixed>
              <HeaderCell>Nome</HeaderCell>
              <Cell dataKey="Nome"/>
            </Column>

            <Column width={200} fixed>
              <HeaderCell>Sobrenome</HeaderCell>
              <Cell dataKey="Sobrenome"/>
            </Column>

            <Column width={200} fixed>
              <HeaderCell>Cidade</HeaderCell>
              <Cell dataKey="Cidade"/>
            </Column>

            <Column width={200} fixed>
              <HeaderCell>Endereço</HeaderCell>
              <Cell dataKey="Endereço"/>
            </Column>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default Customers;
