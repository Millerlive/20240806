import { useRef, useEffect, useState } from "react";
import { Form, Input, InputNumber, Modal } from "antd";
const useInput = () => {
  const [value, setValue] = useState("");
  const onChange = (e) => {
    setValue(e.target.value);
  };
  return { value, onChange };
};
const useResetFormOnCloseModal = ({ form, open }) => {
  const prevOpenRef = useRef();
  useEffect(() => {
    prevOpenRef.current = open;
  }, [open]);
  const prevOpen = prevOpenRef.current;
  useEffect(() => {
    if (!open && prevOpen) {
      form.resetFields();
    }
  }, [form, prevOpen, open]);
};
const ModalForm = ({ open, onCancel, addData }) => {
  const [form] = Form.useForm();
  useResetFormOnCloseModal({
    form,
    open,
  });
  const { value: name, onChange: nameChange } = useInput();
  const { value: age, onChange: ageChange } = useInput();
  const { value: address, onChange: addressChange } = useInput();
  const onOk = () => {
    let item = { name, age, address, key: parseInt(Math.random() * 10000) };
    if (name && age && address) {
      addData(item);
      onCancel();
    }
  };
  return (
    <Modal title="添加用户" open={open} onOk={onOk} onCancel={onCancel}>
      <Form form={form} layout="vertical" name="userForm">
        <Form.Item
          name="name"
          label="姓名"
          onChange={(e) => {
            nameChange(e);
          }}
          rules={[
            {
              required: true,
              message: "请输入您的姓名",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="age"
          label="年龄"
          onChange={(e) => {
            ageChange(e);
          }}
          rules={[
            {
              required: true,
              message: "请输入您的年龄",
            },
          ]}
        >
          <InputNumber />
        </Form.Item>
        <Form.Item
          name="address"
          label="地址"
          onChange={(e) => {
            addressChange(e);
          }}
          rules={[
            {
              required: true,
              message: "请输入地址",
            },
          ]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};
export default ModalForm;
