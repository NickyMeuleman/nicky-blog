/** @jsx jsx */
import { jsx } from 'theme-ui';
import Layout from '../components/Layout';

const Uses = ({ passedSx }) => {
  return (
    <Layout>
      <div
        sx={{
          display: 'grid',
          gridTemplateColumns: '1fr minmax(20ch, 70ch) 1fr',
        }}
      >
        <div sx={{ gridColumn: '2/3', py: 5 }}>
          <h1>What I use</h1>
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Expedita
          animi fuga, tempore nostrum consequatur sunt esse modi voluptatibus
          voluptates voluptatum quidem vel eum incidunt, dolorem, itaque sit
          eveniet cumque unde. Nemo quod sit rerum cum qui placeat, blanditiis
          vel magnam accusamus debitis repellat inventore ipsam fuga harum
          pariatur eum quasi labore veniam molestias aut quibusdam deleniti
          odit. Eveniet amet recusandae, doloribus blanditiis, facere a
          repellendus doloremque consequuntur magnam itaque porro quasi autem
          reprehenderit totam cupiditate corporis qui dicta provident nulla et.
          Provident eum illum error ab quia excepturi, voluptate earum iusto
          similique nulla rerum explicabo? Quisquam quos quia reiciendis non?
        </div>
      </div>
    </Layout>
  );
};

export default Uses;
