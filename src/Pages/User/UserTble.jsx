import React, { useEffect, useState } from "react";
import {
  Form,
  Button,
  Table,
  Space,
  Typography,
  Popconfirm,
  Input,
  InputNumber,
  Modal,
} from "antd";
import "./UserTable.css";
import dataSource from "./data";
import ModalForm from "./ModalForm";
const UserTable = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [editingKey, setEditingKey] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const showModal = () => {
    setOpen(true);
  };
  const hideModal = () => {
    setOpen(false);
  };
  useEffect(() => {
    setData(dataSource);
  }, []);

  const isEditing = (record) => record.key === editingKey;
  const edit = (record) => {
    form.setFieldsValue({
      name: "",
      age: "",
      address: "",
      ...record,
    });
    setEditingKey(record.key);
  };
  const cancel = () => {
    setEditingKey("");
  };
  const save = async (key) => {
    try {
      const row = await form.validateFields();
      const newData = [...data];
      const index = newData.findIndex((item) => key === item.key);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        setData(newData);
        setEditingKey("");
      } else {
        newData.push(row);
        setData(newData);
        setEditingKey("");
      }
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
  };
  const EditableCell = ({
    editing,
    dataIndex,
    title,
    inputType,
    record,
    index,
    children,
    ...restProps
  }) => {
    const inputNode = inputType === "number" ? <InputNumber /> : <Input />;
    return (
      <td {...restProps}>
        {editing ? (
          <Form.Item
            name={dataIndex}
            style={{
              margin: 0,
            }}
            rules={[
              {
                required: true,
                message: `Please Input ${title}!`,
              },
            ]}
          >
            {inputNode}
          </Form.Item>
        ) : (
          children
        )}
      </td>
    );
  };

  const columns = [
    {
      title: "姓名",
      dataIndex: "name",
      render: (text) => <a>{text}</a>,
      editable: true,
    },
    {
      title: "年龄",
      dataIndex: "age",
      editable: true,
    },
    {
      title: "地址",
      dataIndex: "address",
      editable: true,
    },
    {
      title: "删除",
      dataIndex: "Delete",
      render: (_, record) => (
        <Space size="middle">
          <span
            className="pointer"
            onClick={() => {
              delUser(record.key);
            }}
          >
            删除
          </span>
        </Space>
      ),
    },
    {
      title: "编辑",
      dataIndex: "edit",
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Typography.Link
              onClick={() => save(record.key)}
              style={{
                marginInlineEnd: 8,
              }}
            >
              确定
            </Typography.Link>
            {/* <Popconfirm title="取消编辑?" onConfirm={cancel}> */}
            <a onClick={cancel}>取消</a>
            {/* </Popconfirm> */}
          </span>
        ) : (
          <Typography.Link
            disabled={editingKey !== ""}
            onClick={() => edit(record)}
          >
            编辑
          </Typography.Link>
        );
      },
    },
  ];
  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: col.dataIndex === "age" ? "number" : "text",
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  let [selRowKeys, setSelRowKeys] = useState([]);
  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      // 选中的key值选中的数据
      console.log(
        `selectedRowKeys: ${selectedRowKeys}`,
        "selectedRows: ",
        selectedRows
      );
      setSelRowKeys(selectedRowKeys);
    },
  };
  const delUser = (key) => {
    let newData = [...data];
    const index = newData.findIndex((v) => v.key === key);
    newData.splice(index, 1);
    setData([...newData]);
  };

  const addData = (item) => {
    setData([...data, item]);
  };
  const delMany = () => {
    if (selRowKeys.length ===0) {
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 500);
    let newData = [];
    data.forEach((item) => {
      if (!selRowKeys.includes(item.key)) {
        newData.push(item);
      }
    });
    console.log("newData", newData, selRowKeys);
    setData(newData);
  };
  return (
    <>
      <Button
        onClick={showModal}
        type="primary"
        style={{
          marginBottom: 16,
          marginRight: 16,
        }}
      >
        添加用户
      </Button>
      <Popconfirm
        title="确定删除?"
        onConfirm={delMany}
        okText="确定"
        cancelText="取消"
      >
        <Button
          // onClick={delMany}
          type="primary"
          style={{
            marginBottom: 16,
          }}
        >
          删除用户
        </Button>
      </Popconfirm>
      <ModalForm open={open} onCancel={hideModal} addData={addData} />

      <Form form={form} component={false}>
        <Table
          loading={loading}
          rowClassName="editable-row"
          components={{
            body: {
              cell: EditableCell,
            },
          }}
          rowSelection={{
            ...rowSelection,
          }}
          columns={mergedColumns}
          dataSource={data}
          pagination={{
            position: ["bottomcenter"],
            pageSize: "4",
          }}
        />
      </Form>
    </>
  );
};
export default UserTable;
