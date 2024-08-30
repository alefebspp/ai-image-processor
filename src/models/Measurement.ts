import { Entity, Column, PrimaryGeneratedColumn } from "typeorm"

@Entity()
export class Measurement {

    @PrimaryGeneratedColumn("uuid")
    measure_uuid: string

    @Column()
    image_url: string

    @Column()
    customer_code: string

    @Column({ type: 'timestamptz' })
    measure_datetime: Date

    @Column()
    measure_type: string

    @Column("boolean", {default: false})
    confirmed: boolean = false;

    @Column("float", {default: null})
    confirmed_value: number | null = null;
}