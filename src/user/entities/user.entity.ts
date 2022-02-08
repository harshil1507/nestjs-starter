import { Role } from 'src/enum/role.enum';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, unique: true })
  email: string;

  @Column({ nullable: false })
  password: string;

  @Column({ nullable: false, type: 'enum', enum: Role, default: Role.User })
  role: string;

  @Column('timestamp with time zone', {
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @Column('timestamp with time zone', {
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;
}
