export interface IPlsqlArgument {
    argument_name: string;
    data_type: string;
}
export interface IPlsqlProcedure {
    object_name: string;
    arguments?: IPlsqlArgument[];
}
export type tIPlsqlProcedure = IPlsqlProcedure;
