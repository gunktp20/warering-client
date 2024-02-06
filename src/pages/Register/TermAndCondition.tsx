function TermAndCondition() {
  return (
    <div className="flex items-center">
      <input
        id="link-checkbox"
        type="checkbox"
        value=""
        className="w-[13px] h-[13px] text-[#2CB1BC] bg-gray-100 border-gray-300 rounded focus:ring-[#fff] dark:focus:ring-[#2CB1BC] dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
      />
      <label
        htmlFor="link-checkbox"
        className="ms-2 text-[11.5px] font-medium text-gray-900 dark:text-gray-300"
      >
        I agree with the{" "}
        <a
          href="#"
          className="text-[#3173B1] dark:text-[#3173B1] hover:underline"
        >
          terms and conditions
        </a>
        .
      </label>
    </div>
  );
}

export default TermAndCondition;
