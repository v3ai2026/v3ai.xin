import {
    CreateDateColumn,
    DeleteDateColumn,
    Index,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "../typeorm";

/**
 * Base Entity
 */
export abstract class BaseEntity {
    /**
     * Primary key
     */
    @PrimaryGeneratedColumn("uuid")
    @Index()
    id: string;

    /**
     * Creation time (autofilling)
     */
    @CreateDateColumn({ type: "timestamptz" })
    createdAt: Date;

    /**
     * Update time (automatically maintained every time the entity is updated)
     */
    @UpdateDateColumn({ type: "timestamptz" })
    updatedAt: Date;
}

/**
 * Soft delete basic entity
 */
export abstract class SoftDeleteBaseEntity extends BaseEntity {
    /**
     * Soft deletion time (with value means deleted)
     */
    @DeleteDateColumn({ type: "timestamptz", nullable: true })
    deletedAt?: Date | null;
}
