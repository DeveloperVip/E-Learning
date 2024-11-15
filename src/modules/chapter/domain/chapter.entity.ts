import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('chapter')
export class ChapterEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
//   @Column({name:'program',type:'varchar'})
//   program:
}
