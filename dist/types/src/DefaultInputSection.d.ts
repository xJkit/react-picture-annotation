/// <reference types="react" />
export interface IDefaultInputSection {
    value: string;
    placeholder?: string;
    onChange: (value: string) => void;
    onDelete: () => void;
}
declare const _default: ({ value, onChange, onDelete, placeholder, }: IDefaultInputSection) => JSX.Element;
export default _default;
