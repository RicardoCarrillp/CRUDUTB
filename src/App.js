import React, { useState, useEffect } from "react";
import axios from "axios";
import "antd/dist/antd.css";
import "./App.css";
import {
  Table,
  Button,
  Form,
  Layout,
  Menu,
  Modal,
  Input,
  notification,
} from "antd";
import {
  EditOutlined,
  UserOutlined,
  DeleteOutlined,
  DeploymentUnitOutlined,
} from "@ant-design/icons";

const baseURL = "https://petstore.swagger.io/v2/pet";
const { Item } = Form;

const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};

const App = () => {
  const [data, setData] = useState([]);
  const [modalInsert, setmodalInsert] = useState(false);
  const [modalEdit, setmodalEdit] = useState(false);
  const [loading, setloading] = useState(false);

  const [, forceUpdate] = useState({});

  const [pet, setpet] = useState({
    id: "",
    name: "",
    category: "",
    categoryID: "",
  });

  const { Header, Content, Footer } = Layout;

  const openModalInsert = () => {
    setmodalInsert(!modalInsert);
  };
  const openModalEdit = () => {
    setmodalEdit(!modalEdit);
  };
  const peticionsGET = async () => {
    setloading(true);
    await axios
      .get(baseURL + "/findByStatus?status=pending,sold,available")
      .then((response) => {
        setData(response.data);
        // console.log(response.data.map(category => (category)))
        setloading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const pickPet = (pet, casee) => {
    setpet(pet);
    if (casee === "edit") openModalEdit();
    else if (casee === "delete") peticionsDELETE(pet);
  };

  const parseData = data.map((categoryGET) => ({
    idC: categoryGET?.category?.id,
    name: categoryGET?.name,
    id: categoryGET?.id,
    nameC: categoryGET?.category?.name,
    status: categoryGET?.status,
  }));
  const openNotificationWithIcon = (type) => {
    notification[type]({
      message: "Mascota Creada",
      description: "La mascota se ha creado con exito.",
    });
  };

  const peticionsPOST = async () => {
    const Pet = {
      id: Math.floor(Math.random() * 1000) + 1,
      name: pet.name,
      category: {
        id: Math.floor(Math.random() * 1000) + 20,
        name: pet.category,
      },
    };

    await axios
      .post(baseURL, Pet)
      .then((response) => {
        openNotificationWithIcon("success");
        // peticionsGET();
        openModalInsert();

        // setloading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const peticionsDELETE = async (e) => {
    // openNotificationWithIconDelete("error",e.id);

    await axios
      .delete(baseURL + `/${e.id}`)
      .then((response) => {
        notification["error"]({
          message: `La mascota con id ${e.id} ha sido eliminada`,
          description: `La mascota llamada ${e.name} se ha eliminado con exito.`,
        });
        peticionsGET();
        // console.log(response.data.map(category => (category)))
      })
      .catch((error) => {
        console.log(error);
      });
  };
  
  const peticionsPUT = async () => {
   
    const Pet = {
      id: pet.id,
      name: pet.name,
      category: {
        id: pet.idC,
        name: pet.nameC,
      },
    };

    await axios
      .put(baseURL ,Pet)
      .then((response) => {

        let Dataxu=data;
        Dataxu.map(element=>{
          
          if(element.id===Pet.id){
            // console.log(Pet);
            // console.log("element",element);
              element.name =Pet.name;
              element.category.name = Pet.category.name;
         


          }


        })
        // setData(Dataxu);

         notification["info"]({
           message: "Mascota editada",
           description: `La mascota con id ${pet.id} se ha editado con exito.`,
         }); 
        openModalEdit();
        setData(Dataxu);

        // setloading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };
 

  useEffect(() => {
    peticionsGET();
    forceUpdate({});
  }, []);

  function onChangeSort(sorter, filters, pagination) {
    // console.log(sorter, filters);
  }

  const handleChange = (e) => {
    setpet({
      ...pet,
      [e.target.name]: e.target.value,
    });
  };

  const columns = [
    {
      title: "ID",
      width: 100,
      dataIndex: "id",
      fixed: "left",
      sorter: {
        compare: (a, b) => a.id - b.id,
        multiple: 3,
      },
    },
    {
      title: "Nombre",
      width: 100,
      dataIndex: "name",
      fixed: "left",
    },
    {
      title: "Categoria",
      width: 100,
      dataIndex: "category",

      children: [
        {
          title: "Animal ID",
          width: 100,
          dataIndex: "idC",
        },
        {
          title: "Animal name",
          width: 100,
          dataIndex: "nameC",
        },
      ],
    },

    {
      title: "Estado",
      dataIndex: "status",
      width: 100,
      filters: [
        { text: "Available", value: "available" },
        { text: "Pending", value: "pending" },
        { text: "Sold", value: "sold" },
      ],
      onFilter: (value, record) => record.status.indexOf(value) === 0,
      sorter: (a, b) => a.status.length - b.status.length,
      sortDirections: ["descend"],
    },
    {
      title: "Action",

      fixed: "right",
      width: 100,
      render: (row) => (
        <>
          <Button type="primary" onClick={() => pickPet(row, "edit")}>
            <EditOutlined />
          </Button>
          <br />
          <br />
          <Button type="primary" danger onClick={() => pickPet(row, "delete")}>
            <DeleteOutlined />
          </Button>
        </>
      ),
    },
  ];

  return (
    <div className="App">
      <Layout className="layout">
        <Header>
          <div className="logo" />
          <Menu theme="dark" mode="horizontal" defaultSelectedKeys={["1"]}>
            {new Array(1).fill(null).map((_, index) => {
              const key = index + 1;
              return <Menu.Item key={key}>{`Pets`}</Menu.Item>;
            })}
          </Menu>
        </Header>

        <Content style={{ padding: "0 50px" }}>
          <div className="site-layout-content">
            <Button
              type="primary"
              className="BtnInsertar"
              onClick={openModalInsert}
            >
              Crear nueva mascota
            </Button>
            <br />
            <br />
            <Table
              columns={columns}
              dataSource={parseData}
              bordered
              onChange={onChangeSort}
              loading={loading}
            />
          </div>

          <Modal
            visible={modalInsert}
            title="Insertar Mascota"
            destroyOnClose={true}
            centered
            onCancel={openModalInsert}
            footer={[
              <Button type="danger" onClick={openModalInsert}>
                Cancelar
              </Button>,

              <Button type="prymary" htmlType="submit" onClick={peticionsPOST}>
                Enviar
              </Button>,
            ]}
          >
            <Form {...layout}>
              <Item
                label="Nombre"
                rules={[
                  { required: true, message: "Please input your username!" },
                ]}
              >
                <Input
                  placeholder="Ingrese un nombre"
                  name="name"
                  onChange={handleChange}
                  prefix={<UserOutlined className="site-form-item-icon" />}
                />
              </Item>
              <Item
                label="Tipo de mascota"
                rules={[
                  { required: true, message: "Please input your username!" },
                ]}
              >
                <Input
                  name="category"
                  placeholder="Ingrese una especie"
                  onChange={handleChange}
                  prefix={
                    <DeploymentUnitOutlined className="site-form-item-icon" />
                  }
                />
              </Item>
            </Form>
          </Modal>

          {/* EDITAR */}

          <Modal
            visible={modalEdit}
            title="Editar Mascota"
            centered
            onCancel={openModalEdit}
            footer={[
              <Button type="danger" onClick={openModalEdit}>
                Cancelar
              </Button>,

              <Button type="prymary" htmlType="submit" onClick={peticionsPUT}>
                Enviar
              </Button>,
            ]}
          >
            <Form {...layout}>
              <Item
                label="Nombre"
                rules={[
                  { required: true, message: "Please input your username!" },
                ]}
              >
                <Input
                  placeholder="Ingrese un nombre"
                  name="name"
                  value={pet && pet.name}
                  onChange={handleChange}
                  prefix={<UserOutlined className="site-form-item-icon" />}
                />
              </Item>
              <Item
                label="Tipo de mascota"
                rules={[
                  { required: true, message: "Please input your username!" },
                ]}
              >
                <Input
                  name="nameC"
                  placeholder="Ingrese una especie"
                  value={pet && pet.nameC}
                  onChange={handleChange}
                  prefix={
                    <DeploymentUnitOutlined className="site-form-item-icon" />
                  }
                />
              </Item>
            </Form>
          </Modal>
        </Content>
        <Footer style={{ textAlign: "center" }}>
          Ant Design ©2018 Created by Ant UED
        </Footer>
      </Layout>
    </div>
  );
};

export default App;
