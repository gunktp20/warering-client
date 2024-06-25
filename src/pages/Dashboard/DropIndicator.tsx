interface IDropIndicator {
    beforeId: unknown;
    column: "column-1" | "column-2" | "column-3" | string
}

const DropIndicator = ({ beforeId, column }: IDropIndicator) => {
    return (
        <div
            data-before={beforeId || "-1"}
            data-column={column}
            className="my-0.5 h-[5px] w-full bg-primary-100 opacity-0"
        />
    );
};

export default DropIndicator