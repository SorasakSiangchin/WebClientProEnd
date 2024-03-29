import { HeartFilled } from '@ant-design/icons';
import { Avatar, Button, Card, Col, Divider, Empty, Pagination, Row } from 'antd';
import { Fragment, useEffect } from 'react'
import { Container } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom'
import useFavorite from '../../app/hooks/useFavorite';
import usePagination from '../../app/hooks/usePagination';
import MainContainer from '../../app/layout/MainContainer';
import TopSection from '../../app/layout/TopSection';
import { Product } from '../../app/models/Product';
import { useAppDispatch, useAppSelector } from '../../app/store/configureStore';
import {
    fetchProductAsync,
    fetchProductsAsync,
    productSelectors,
    resetProductParams,
} from '../../app/store/productSlice';
import { currencyFormat, pathHome } from '../../app/util/util';

const ProductsSimilar = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { checkFavorite, addFavorite, removeFavorite } = useFavorite();
    const { productId } = useParams<{ productId: any }>();
    const product = useAppSelector(state => productSelectors.selectById(state, productId));
    const products = useAppSelector(productSelectors.selectAll);
    const { current, handleChange, maxIndex, minIndex, pageSize } = usePagination({ pageSize: 12 });

    useEffect(() => {
        if (!product) dispatch(fetchProductAsync(productId));
        dispatch(fetchProductsAsync());
    }, [productId, dispatch, product]);

    useEffect(() => {
        return () => {
            dispatch(resetProductParams());
        }
    }, []);
    
    const productInfo = products?.filter(e => e.id !== product?.id && e.categoryProduct.name === product?.categoryProduct?.name);

    return (
        <Fragment>
            <TopSection
                text={""}
                title="สินค้าที่คล้ายกัน"
                backToPageTitle="หน้าแรก"
                backToPageUrl={pathHome}
            />
            <MainContainer className="col1-layout wow bounceInUp animated animated">
                <div className="row">
                    <div className="std">
                        <div className="wrapper_bl">
                            <div className="form_background">
                                <div className="pro-coloumn">
                                    <Card
                                        style={{ width: "100%" }}
                                        bordered
                                    >
                                        <Row gutter={24}>
                                            <Col span={18}>
                                                <Card.Meta
                                                    avatar={<img style={{ width: "20rem", height: "20rem" }} src={product?.imageUrl} />}
                                                    title={<h2 className='text-st'>{product?.name}</h2>}
                                                    description={
                                                        <>
                                                            <h5 className='text-st'>
                                                                {product?.description}
                                                            </h5>
                                                            <h4 className='text-st'>
                                                                {currencyFormat(product?.price)}
                                                            </h4>
                                                            <Button type='primary' className='text-st' onClick={() => navigate(`/product/detail/${product?.id}`)}>
                                                                ซื้อเลย
                                                            </Button>
                                                        </>
                                                    }
                                                />
                                            </Col>
                                            <Col span={1}>
                                                <Divider style={{ height: "100%" }} type='vertical' />
                                            </Col>
                                            <Col span={5}>
                                                <Card.Meta
                                                    className='text-st'
                                                    avatar={<Avatar style={{ width: "6rem", height: "6rem" }} src={product?.account?.imageUrl} />}
                                                    title={product?.account?.firstName}
                                                    description={`สินค้าทั้งหมด ${product?.account?.products?.length} รายการ`}
                                                />
                                            </Col>
                                        </Row>
                                    </Card>
                                    <Container style={{ marginTop: '1rem' }}>
                                        <h2 className='text-st'>
                                            สินค้าที่คล้ายกัน
                                        </h2>
                                        <Row gutter={24}>
                                            {productInfo.length > 0 ? productInfo.map((product , index) => {
                                                const onFavorite = (info: Product) => {
                                                    if (!checkFavorite(product?.id)) addFavorite(info);
                                                    else removeFavorite(info.id);
                                                };
                                                return index >= minIndex &&
                                                index < maxIndex && <Col key={product.id} span={6} style={{ marginTop : "3rem" }}>
                                                    <Card
                                                        onClick={() => navigate(`/product/detail/${product?.id}`)}
                                                        hoverable
                                                        bordered
                                                        style={{ width: "100%" }}
                                                        cover={
                                                            <img
                                                                alt="product-image"
                                                                src={product.imageUrl}
                                                                style={{
                                                                    height: "20rem"
                                                                }}
                                                            />
                                                        }
                                                        actions={[
                                                            <Button
                                                                onClick={() => onFavorite(product)}
                                                                className='text-st'
                                                                type="text"
                                                                icon={<HeartFilled style={{ fontSize: "15px", color: checkFavorite(product?.id) ? "red" : "" }} />}
                                                            >
                                                                รายการโปรด
                                                            </Button>
                                                        ]}
                                                    >
                                                        <Card.Meta
                                                            className='text-st'
                                                            title={product.name}
                                                            description={
                                                                <span id="product-price-212" className="price">
                                                                    {currencyFormat(product.price)}
                                                                </span>
                                                            }
                                                        />
                                                    </Card>

                                                </Col>
                                            }) : <Container><Empty className='text-st' description="ไม่มีสินค้า" /></Container>}
                                        </Row>
                                    </Container>
                                    {productInfo.length > 0 && <Pagination
                                        pageSize={pageSize}
                                        current={current}
                                        total={productInfo.length}
                                        onChange={handleChange}
                                        className="center"
                                        style={{ marginTop: "30px" }}
                                    />}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </MainContainer>
        </Fragment>
    )
}

export default ProductsSimilar