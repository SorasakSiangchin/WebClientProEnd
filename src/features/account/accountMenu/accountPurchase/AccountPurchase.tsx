import { Tabs } from 'antd';
import useOrder from '../../../../app/hooks/useOrder';
import { ColAccount } from '../../AccountPage';
import type { TabsProps } from 'antd';
import { Container } from 'react-bootstrap';
import Orders from './Orders';
import { useState } from 'react';
import OrderDetail from './OrderDetail';
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from '../../../../app/store/configureStore';
import { resetParams, setParams } from '../../../../app/store/orderSlice';
import { Delivery } from '../../../../app/models/Delivery';
import { OrderUsage } from '../../../../app/models/Order';

const AccountPurchase = () => {
    const dispatch = useAppDispatch();
    const { account } = useAppSelector(state => state.account);

    useEffect(() => {
        dispatch(resetParams());
        dispatch(setParams({ accountId: account?.id, orderUsage: OrderUsage.Buy.toString() }));
    }, []);

    const { orders } = useOrder();
    const [orderPage, setOrderPage] = useState<boolean>(false);
    const [orderId, setOrderId] = useState<string>("");
    const [delivery, setDelivery] = useState<Delivery | null>(null);
    const items: TabsProps['items'] = [
        {
            key: '1',
            label: `ทั้งหมด`,
            children: <Orders
                setDataDelivery={setDelivery}
                orders={orders}
                setOrderPage={setOrderPage}
                setOrderId={setOrderId}
            />,
        },
        {
            key: '2',
            label: `ที่ต้องชำระเงิน`,
            children: <Orders
                setDataDelivery={setDelivery}
                orders={orders?.filter(e => e.orderCancel === false && e.orderStatus === 0 || e.orderStatus === 1)}
                setOrderPage={setOrderPage}
                setOrderId={setOrderId}
            />,
        },
        {
            key: '3',
            label: `ที่ต้องได้รับ`,
            children: <Orders
                setDataDelivery={setDelivery}
                orders={orders?.filter(e => e.customerStatus === false && e.orderStatus === 2)}
                setOrderPage={setOrderPage}
                setOrderId={setOrderId}
            />,
        },
        {
            key: '4',
            label: `สำเร็จแล้ว`,
            children: <Orders
                setDataDelivery={setDelivery}
                orders={orders?.filter(e => e.orderCancel === false && e.customerStatus === true)}
                setOrderPage={setOrderPage}
                setOrderId={setOrderId}
            />,
        },
        {
            key: '5',
            label: `ยกเลิก`,
            children: <Orders
                setDataDelivery={setDelivery}
                orders={orders?.filter(e => e.orderCancel === true)}
                setOrderPage={setOrderPage}
                setOrderId={setOrderId}
            />,
        }
    ];

    const ShowData = () => {
        if (!orderPage) return (
            <Container>
                <Tabs className='text-st' defaultActiveKey="1" items={items} />
            </Container>
        )
        else return <OrderDetail delivery={delivery} orderId={orderId} setOrderPage={setOrderPage} />
    }

    return (
        <ColAccount className="col-main col-sm-9" >
            <div className="my-account">
                <div className="dashboard">
                    <ShowData />
                </div>
            </div>
        </ColAccount>
    )
}

export default AccountPurchase