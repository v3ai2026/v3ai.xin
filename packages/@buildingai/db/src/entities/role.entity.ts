import { AppEntity } from "../decorators/app-entity.decorator";
import { Permission } from "../entities/permission.entity";
import { User } from "../entities/user.entity";
import { Column, JoinTable, ManyToMany, OneToMany } from "../typeorm";
import { BaseEntity } from "./base";

/**
 * 角色实体
 *
 * 定义系统中的角色及其关联的权限
 */
@AppEntity({ name: "roles", comment: "角色管理" })
export class Role extends BaseEntity {
    /**
     * 角色名称
     *
     * 例如: "admin", "editor", "user"
     */
    @Column({ unique: true })
    name: string;

    /**
     * 角色描述
     */
    @Column({ nullable: true })
    description: string;

    /**
     * 角色关联的权限
     *
     * 多对多关系，一个角色可以有多个权限，一个权限可以属于多个角色
     */
    @ManyToMany(() => Permission)
    @JoinTable({
        name: "role_permissions",
        joinColumn: { name: "role_id", referencedColumnName: "id" },
        inverseJoinColumn: {
            name: "permission_id",
            referencedColumnName: "id",
        },
    })
    permissions: Permission[];

    /**
     * 角色关联的用户
     *
     */
    @OneToMany(() => User, (user) => user.role)
    users: User[];

    /**
     * 是否禁用
     *
     * 禁用的角色将不能被分配给用户，已分配该角色的用户将无法使用该角色的权限
     */
    @Column({ default: false })
    isDisabled: boolean;
}
