import { PayConfigType } from "@buildingai/constants/shared/payconfig.constant";
import { REFUND_ORDER_FROM_VALUE } from "@common/modules/refund/constants/refund.constants";
import { EntityManager } from "typeorm/entity-manager/EntityManager";

export interface OrderRefundParams {
    entityManager: EntityManager;
    orderId: string;
    userId: string;
    orderNo: string;
    from: REFUND_ORDER_FROM_VALUE;
    transactionId: string;
    payType: PayConfigType;
    orderAmount: number;
    refundAmount: number;
}
