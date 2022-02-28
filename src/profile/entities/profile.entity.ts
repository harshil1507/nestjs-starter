import { User } from 'src/user/entities/user.entity';
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
//WIP - ONE-TO-ONE relation with user
@Entity('profile')
export class Profile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  profilePicture: string;

  @Column()
  country: string;

  @Column()
  zipCode: string;

  @OneToOne(() => User, (user) => user.profile, { nullable: true })
  user: User;
}
