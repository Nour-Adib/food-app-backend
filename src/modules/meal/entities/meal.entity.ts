import { BaseEntity } from '../../../common/entities/base.entity';
import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, ManyToOne } from 'typeorm';
import { User } from '../../user/entities/user.entity';

@Entity()
export class Meal extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  spoonacularId: string;

  @Column()
  name: string;

  @Column()
  calories: number;

  @Column()
  carbs: number;

  @Column()
  fat: number;

  @Column()
  protein: number;

  @Column()
  serving: number;

  @ManyToOne(() => User, (user) => user.meals, {
    onDelete: 'CASCADE'
  })
  user: User;
}
