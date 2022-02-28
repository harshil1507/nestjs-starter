import { TokenTypeEnum } from 'src/enum/token-type.enum';
import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Index(['email', 'type'])
@Entity('token')
export class Token {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column({ type: 'enum', enum: TokenTypeEnum })
  type: TokenTypeEnum;

  @Column()
  token: number;

  @Column()
  expiry: Date;
}
