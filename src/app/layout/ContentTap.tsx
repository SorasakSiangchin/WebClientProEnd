import { LoadingOutlined, ShopOutlined } from '@ant-design/icons';
import {
    Avatar,
    Button,
    Card,
    Col,
    Descriptions,
    Divider,
    Empty,
    Image,
    Radio,
    Rate,
    Row,
    Space,
    Spin,
} from 'antd';
import React, { Fragment, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import { Review, ReviewResponse } from '../models/Review';
import { Product } from '../models/Product';
import { useAppDispatch, useAppSelector } from '../store/configureStore';
import { fetchDetailProductByIdProductAsync, reSetDetailProduct } from '../store/detailProductSlice';
import moment from 'moment-timezone';
import AppPagination from '../components/AppPagination';
import { MetaData } from '../models/Pagination';
import { useNavigate } from 'react-router-dom';

interface Props {
    ids: any;
    product: Product | undefined;
    reviewsLoaded: boolean;
    setParams: Function;
    metaData: MetaData | null;
    reviews: ReviewResponse | null

}

interface IComment {
    reviewData: Review
}

const infoRadioButton = [
    { value: 0, title: "ทั้งหมด" },
    { value: 5, title: "5 ดาว" },
    { value: 4, title: "4 ดาว" },
    { value: 3, title: "3 ดาว" },
    { value: 2, title: "2 ดาว" },
    { value: 1, title: "1 ดาว" }
];

const ContentTap = ({ ids, product, reviewsLoaded, setParams, metaData, reviews }: Props) => {
    return (
        <Fragment>
            <ReviewTap
                id={ids[0]}
                reviewsLoaded={reviewsLoaded}
                setParams={setParams}
                metaData={metaData}
                reviews={reviews}
            />
            <ProductStore id={ids[1]} account={product?.account} />
            <ProductDetail id={ids[2]} product={product} />
        </Fragment>
    )
};

const ReviewTap = ({ id, reviewsLoaded, setParams, metaData, reviews }: any) => {
    const dispatch = useAppDispatch();
    const rate = (
        <>
            <h1 className='text-st' style={{ display: "inline" }}>{reviews?.averageScore}</h1>
            <h2 className='text-st' style={{ display: "inline" }}> เต็ม 5</h2>
        </>
    );
    const loadingIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

    return <div className="tab-pane fade in active" id={id}>
        <div className="woocommerce-Reviews">
            <h2 className="woocommerce-Reviews-title"><span>ความคิเห็นสินค้า</span></h2>
            <Card bordered style={{ backgroundColor: "#F1FFE4" }}>
                <Row gutter={24} >
                    <Col span={4} className="center">
                        <div>
                            {rate}
                            <Rate disabled value={Number(reviews?.averageScore)} />
                        </div>
                    </Col>
                    <Col span={20} style={{ display: "flex", justifyContent: "end" }}>
                        <Radio.Group
                            defaultValue={0}
                            onChange={(e) => dispatch(setParams({ score: parseInt(e.target.value) }))}
                            buttonStyle="solid"
                        >
                            {
                                React.Children.toArray(infoRadioButton.map((info) =>
                                <Radio.Button className='text-st' value={info.value}>{info.title}</Radio.Button>))
                                
                            }
                        </Radio.Group>
                    </Col>
                </Row>
            </Card>
            <br />
            <ol className="commentlist">
                {
                    reviewsLoaded ?
                        React.Children.toArray(reviews?.reviews?.map((review: Review) => <Comment reviewData={review} />)) :
                        <Spin indicator={loadingIcon} />
                }
            </ol>
            <Container style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
            }}>
                {Number(reviews?.reviews?.length) > 0 && metaData ? (
                    <AppPagination
                        metaData={metaData}
                        onPageChange={(page: number) =>
                            dispatch(setParams({ pageNumber: page }))
                        }
                        isSimple={false}
                    />
                ) : <Empty className='text-st' description="ยังไม่มีคะแนน" image={Empty.PRESENTED_IMAGE_SIMPLE} />}

            </Container>
        </div>
    </div>
};

const ProductStore = ({ id, account }: any) => {
    const navigate = useNavigate();
    return <div className="tab-pane fade" id={id}>
        <div className="product-tabs-content-inner clearfix" >
            <Row gutter={24}>
                <Col span={20} >
                    <Space>
                        <div>
                            <Card.Meta
                                style={{ width: "100%" }}
                                avatar={<Avatar src={account?.imageUrl} size={100} />}
                            />
                        </div>
                        <div style={{ display: "flex" }}>
                            <Col className='text-st'>
                                <h2>{account?.firstName}</h2>
                                <p>สินค้าทั้งหมด {account?.products?.length} รายการ</p>
                                <br />
                                <br />
                            </Col>
                        </div>
                    </Space>
                </Col>
                <Col span={4} style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "end"
                }}>
                    <Button
                        className='text-st'
                        size='large'
                        onClick={() => navigate("/product/detail/seller", { state: account })}
                        icon={<ShopOutlined />}
                    >
                        ดูร้านค้า
                    </Button>
                </Col>
            </Row>
        </div>
    </div>
};

const ProductDetail = ({ id, product }: any) => {
    const dispatch = useAppDispatch();
    const { detailProduct, detailProductLoaded } = useAppSelector(state => state.detailProduct);

    useEffect(() => {
        dispatch(fetchDetailProductByIdProductAsync(product?.id));
        return () => {
            dispatch(reSetDetailProduct());
        }
    }, [detailProductLoaded, dispatch]);

    const infoProduct = [
        { title: 'ประเภทสินค้า', info: product?.categoryProduct.name },
        { title: 'น้ำหนัก', info: `${product?.weight} ${product?.weightUnit.name}` },
        { title: 'สี', info: <Card style={{ height: "30px", backgroundColor: product?.color }} /> },
    ];

    const infoDetailProduct = [
        { title: 'ชื่อพันธุ์', info: detailProduct?.speciesName },
        { title: 'วิธีการใส่ปุ๋ย', info: detailProduct?.fertilizeMethod },
        { title: 'วิธีการปลูก', info: detailProduct?.plantingMethod },
        { title: 'ฤดูปลูก', info: detailProduct?.growingSeason },
        { title: 'ฤดูเก็บเกี่ยว', info: detailProduct?.harvestTime },
        { title: 'เพิ่มเติม', info: detailProduct?.description },
    ];

    return <div className="tab-pane fade" id={id}>
        <div className="product-tabs-content-inner clearfix" >
            <Row gutter={24}>
                <Col span={11} >
                    <Descriptions column={1} title={<u>รายละเอียดสินค้า</u>} className='text-st'>
                        {React.Children.toArray(infoProduct.map(({ info, title }) => <Descriptions.Item labelStyle={{ fontWeight: "bold" }} label={title}>{info}</Descriptions.Item>))}
                    </Descriptions>
                </Col>
                <Col span={2} className='center'>
                    <Divider type='vertical' style={{ height: "100%" }} />
                </Col>
                <Col span={11}>
                    <Descriptions column={1} title={<u>ข้อมูลจำเพาะของสินค้า</u>} className='text-st'>
                        {detailProduct && React.Children.toArray(infoDetailProduct.map(({ info, title }) => <Descriptions.Item labelStyle={{ fontWeight: "bold" }} label={title}>{info}</Descriptions.Item>))}
                    </Descriptions>
                    {!detailProduct && <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="ไม่มีข้อมูล" className='text-st' />}
                </Col>
            </Row>
        </div>
    </div>
};

const Comment = ({ reviewData }: IComment) => {
    const { account, created, vdoUrl, imageReviews, information, score } = reviewData;
    const fullName = `${account?.firstName} ${account?.lastName}`;
    return <li className="comment">
        <div>
            <img alt="image" style={{ width: "4rem", height: "4rem" }} src={account?.imageUrl} className="avatar avatar-60 photo" />
            <div className="comment-text">
                <div className="ratings">
                    <Rate style={{ fontSize: "1rem" }} disabled value={Number(score)} />
                </div>
                <p className="meta">
                    <strong>{fullName}</strong>{"  "}
                    <span>–</span> {moment.utc(created).tz('Asia/Bangkok').format('YYYY-MM-DD HH:mm:ss')}
                </p>
                <div className="description">
                    <p>{information}</p>
                </div>
                <div className="description">
                    <Space>
                        {React.Children.toArray(imageReviews?.map((image) =>
                            <Image width="10rem" height="10rem" alt='review-image' src={image.imageUrl} />
                        ))}
                        {
                            vdoUrl !== "" ?
                                <video width="100rem" height="105rem" controls >
                                    <source src={vdoUrl} type="video/mp4" />
                                </video> : ""
                        }
                    </Space>
                </div>
            </div>
        </div>
    </li>
};

export default ContentTap