import { User } from 'src/user/entities/user.entity';
import {
  Column,
  Entity,
  Generated,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

//WIP - ONE-TO-ONE relation with user
@Entity('account')
export class Account {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Generated('uuid')
  uuid: string;

  @Column({ default: false })
  isPremium: boolean;

  @OneToOne(() => User, (user) => user.account)
  user: User;
}
