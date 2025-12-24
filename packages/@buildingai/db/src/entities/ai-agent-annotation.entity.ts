import { AppEntity } from "../decorators/app-entity.decorator";
import { Column, Index, JoinColumn, ManyToOne } from "../typeorm";
import { BaseEntity } from "./base";
import { User } from "./user.entity";

export enum AnnotationReviewStatus {
    PENDING = "pending",
    APPROVED = "approved",
    REJECTED = "rejected",
}

@AppEntity({ name: "ai_agent_annotation", comment: "智能体标注管理" })
export class AgentAnnotation extends BaseEntity {
    @Column({ type: "uuid", comment: "智能体ID" })
    @Index()
    agentId: string;

    @Column({ type: "text", comment: "提问内容" })
    @Index("idx_annotation_question", { synchronize: false })
    question: string;

    @Column({ type: "text", comment: "答案内容" })
    @Index("idx_annotation_answer", { synchronize: false })
    answer: string;

    @Column({ type: "int", default: 0, comment: "命中次数" })
    @Index("idx_annotation_hit_count")
    hitCount: number;

    @Column({ type: "boolean", default: true, comment: "是否启用" })
    enabled: boolean;

    @Column({
        type: "enum",
        enum: AnnotationReviewStatus,
        default: AnnotationReviewStatus.APPROVED,
        comment: "审核状态：pending-待审核，approved-已通过，rejected-已拒绝",
    })
    @Index()
    reviewStatus: AnnotationReviewStatus;

    @Column({
        type: "uuid",
        nullable: true,
        comment: "审核人ID",
    })
    @Index("idx_annotation_reviewed_by")
    reviewedBy?: string;

    @Column({
        type: "timestamp",
        nullable: true,
        comment: "审核时间",
    })
    reviewedAt?: Date;

    @Column({
        type: "uuid",
        comment: "创建者ID，匿名用户时为空",
        nullable: true,
    })
    createdBy?: string;

    @Column({
        type: "varchar",
        length: 255,
        comment: "匿名用户标识，如设备ID或访问令牌的hash",
        nullable: true,
    })
    @Index("idx_annotation_anonymous_id")
    anonymousIdentifier?: string;

    @ManyToOne(() => User, { onDelete: "CASCADE", nullable: true })
    @JoinColumn({ name: "created_by" })
    user?: User;

    @ManyToOne(() => User, { onDelete: "SET NULL", nullable: true })
    @JoinColumn({ name: "reviewed_by" })
    reviewer?: User;
}
