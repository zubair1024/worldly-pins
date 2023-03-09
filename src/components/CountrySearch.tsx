const CountrySearch = () => {
  return (
    <div>
      <div className={'dropdown dropdown-end w-full'}>
        <input
          type="text"
          className="w-full input input-bordered"
          // value={value}
          // onChange={(e) => onChange(e.target.value)}
          placeholder="Type something..."
          tabIndex={0}
        />
      </div>
    </div>
  );
};

export default CountrySearch;
