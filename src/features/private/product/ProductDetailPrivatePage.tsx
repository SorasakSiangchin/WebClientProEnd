
import { Card, Col, Descriptions, Divider, Image, Row, Space, Upload, Modal, Button, Tag, Empty } from 'antd';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../app/store/configureStore';
import { currencyFormat } from '../../../app/util/util';
import { crateImageProductAsync, deleteImageProductAsync, fetchImageProductsAsync, fetchProductAsync, productSelectors, resetImageProduct } from '../../../app/store/productSlice';
import LayoutPrivate from '../LayoutPrivate';
import React, { useState } from 'react';
import { DeleteFilled, DeleteOutlined, EditOutlined, InfoCircleFilled, RollbackOutlined, UploadOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd/es/upload';
import type { UploadChangeParam, UploadFile } from 'antd/es/upload/interface';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import { beforeUploadAntd } from '../../../app/util/util';
import { IconButton, ImageListItemBar } from '@mui/material';
import { fetchDetailProductByIdProductAsync, reSetDetailProduct, deleteDetailProductAsync } from '../../../app/store/detailProductSlice';
import ModalFormDetailProduct from './ModalFormDetailProduct';
import AppSwalConfirm from '../../../app/components/AppSwalConfirm';

interface IValue {
  id: string;
  formFiles: any,
  productID: any
}

const ProductDetailPrivatePage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const { idProduct } = useParams<{ idProduct: any }>();
  const [loading, setLoading] = useState<boolean>(false);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [urlModal, setUrlModal] = useState<string>("");
  const product = useAppSelector(state => productSelectors.selectById(state, idProduct));
  const { imageProducts, imageProductLoaded } = useAppSelector(state => state.product);
  const { detailProduct, detailProductLoaded } = useAppSelector(state => state.detailProduct);

  useEffect(() => {
    if (!product) dispatch(fetchProductAsync(idProduct));
  }, [idProduct, dispatch, product]);

  useEffect(() => {
    if (!imageProductLoaded) dispatch(fetchImageProductsAsync(idProduct));
    return () => {
      if (imageProducts) dispatch(resetImageProduct());
    };
  }, [imageProductLoaded, dispatch]);

  useEffect(() => {
    dispatch(fetchDetailProductByIdProductAsync(idProduct));
    return () => {
      dispatch(reSetDetailProduct());
    }
  }, [detailProductLoaded, dispatch]);

  const infoProduct = [
    { title: '????????????', info: product?.name },
    { title: '????????????', info: <Tag className='text-st' color={"green"} key={product?.id}>{currencyFormat(product?.price)}</Tag> },
    { title: '????????????', info: product?.stock },
    { title: '??????', info: <Card style={{ height: "30px", backgroundColor: product?.color }} /> },
    { title: '?????????????????????', info: `${product?.weight} ${product?.weightUnit.name}` },
    { title: '????????????????????????????????????', info: product?.categoryProduct.name },
    { title: '????????????????????????', info: product?.description },
  ];

  const infoDetailProduct = [
    { title: '??????????????????????????????', info: detailProduct?.speciesName },
    { title: '??????????????????????????????????????????', info: detailProduct?.fertilizeMethod },
    { title: '?????????????????????????????????', info: detailProduct?.plantingMethod },
    { title: '?????????????????????', info: detailProduct?.growingSeason },
    { title: '???????????????????????????????????????', info: detailProduct?.harvestTime },
    { title: '???????????????????????????', info: detailProduct?.description },
  ];

  const value: IValue = {
    id: "",
    formFiles: null,
    productID: product?.id
  };

  const handleChange: UploadProps['onChange'] = async (info: UploadChangeParam<UploadFile>) => {
    if (info.file.status === 'uploading') {
      setLoading(true);
      return;
    }
    value.formFiles = info.file.originFileObj;
    dispatch(crateImageProductAsync(value));
    value.formFiles = null;
    setLoading(false);
  };

  const textButton = !detailProduct ? "???????????????" : "???????????????";

  const onDelete = (id: any) => {
    AppSwalConfirm({
      icon: "warning",
      onThen: (result: any) => {
        if (result.isConfirmed) {
          dispatch(deleteDetailProductAsync(id));
          dispatch(reSetDetailProduct());
        }
      },
      title: "??????????????????????????????????????????????????????????"
    });
  };

  const extraDetail = <Space>
    {detailProduct && <Button className='text-st' danger type='primary' onClick={() => onDelete(detailProduct?.id)} icon={<DeleteOutlined />}>??????</Button>}
    <Button className='text-st' type='primary' onClick={() => setModalOpen(true)} icon={<EditOutlined />}>{textButton}</Button>
  </Space>

  const buttonUpload = <Upload
    style={{ width: "20px" }}
    multiple={true}
    showUploadList={false}
    beforeUpload={beforeUploadAntd}
    onChange={handleChange}
  >
    <Button className='text-st' loading={loading} icon={<UploadOutlined />}>
      ?????????????????????????????????
    </Button>
  </Upload>

  return (
    <LayoutPrivate>
      <ModalFormDetailProduct modalOpen={modalOpen} setModalOpen={setModalOpen} detailProduct={detailProduct} idProduct={idProduct} />
      <Row  >
        <Col span={8}><h1 className='text-st'>????????????????????????????????????</h1></Col>
        <Col span={8} offset={8} style={{ display: "flex", justifyContent: "end", alignItems: "center" }}>
          <Button style={{ backgroundColor: "grey" }} className='text-st' type="primary" icon={<RollbackOutlined />} onClick={() => navigate(-1)}>
            ????????????
          </Button>
        </Col>
      </Row>
      <Divider />
      <Row gutter={24}>
        <Col span={10}>
          <Space direction='vertical'>
            <Card >
              <Image alt="image-product" width={"100%"} height={"400px"} src={product?.imageUrl} />
            </Card>
            <Card
              style={{ width: "100%" }}
            >
              <Descriptions className='text-st' column={4} title="?????????????????????????????????????????????" extra={buttonUpload} />
              {imageProducts?.length === 0 && <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="?????????????????????????????????" className='text-st' />}
              <ImageList cols={4}>
                <>
                  {imageProducts?.map(item => (
                    <ImageListItem key={item.id}>
                      <Image
                        style={{ width: "100%", height: "100px" }}
                        preview={false}
                        src={item.imageUrl}
                        alt={item.productID}
                      />
                      <ImageListItemBar
                        actionIcon={
                          <IconButton sx={{ color: 'rgba(255, 255, 255, 0.54)' }}>
                            <Space>
                              <InfoCircleFilled onClick={() => {
                                setOpenModal(true);
                                setUrlModal(item.imageUrl);
                              }} />
                              <DeleteFilled onClick={() => dispatch(deleteImageProductAsync(item.id))} />
                            </Space>
                          </IconButton>
                        }
                      />
                    </ImageListItem>
                  ))}
                </>
              </ImageList>
            </Card>
          </Space>
        </Col>
        <Modal open={openModal} footer={null} onCancel={() => {
          setOpenModal(false);
          setUrlModal("");
        }}>
          <img alt="example" style={{ width: '100%' }} src={urlModal} />
        </Modal>
        <Col span={14}>
          <Space direction='vertical'>
            <Card
              style={{ width: "100%" }}
            >
              <Descriptions title={<h4 style={{ textDecoration: "underline" }} >??????????????????</h4>} className='text-st'>
                {React.Children.toArray(infoProduct.map(({ info, title }) => <Descriptions.Item labelStyle={{ fontWeight: "bold" }} label={title}>{info}</Descriptions.Item>))}
              </Descriptions>
            </Card>
            <Card
              style={{ width: "100%" }}
            >
              <Descriptions column={2} title="?????????????????????????????????????????????????????????" className='text-st' extra={extraDetail}>
                {detailProduct && React.Children.toArray(infoDetailProduct.map(({ info, title }) => <Descriptions.Item labelStyle={{ fontWeight: "bold" }} label={title}>{info}</Descriptions.Item>))}
              </Descriptions>
              {!detailProduct && <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="?????????????????????????????????" className='text-st' />}
            </Card>
          </Space>
        </Col>
      </Row>
    </LayoutPrivate>
  )
}
export default ProductDetailPrivatePage;