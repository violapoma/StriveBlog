import Pagination from "react-bootstrap/Pagination";

function MyPagination({ howManyPages, active, setActive }) {
  let items = [];

  function handlePage(newPage) {
    const url = new URL(window.location);
    url.searchParams.set("page", newPage);
    window.history.pushState({}, "", url);
    setActive(newPage);
  }

  for (let number = 1; number <= howManyPages; number++) {
    items.push(
      <Pagination.Item
        key={number}
        active={number == active}
        onClick={() => handlePage(number)}
      >
        {number}
      </Pagination.Item>
    );
  }

  return (
    <div className="d-flex justify-content-center">
    <Pagination>
      <Pagination.First disabled={active === 1} onClick={() => handlePage(1)} />
      <Pagination.Prev
        disabled={active === 1}
        onClick={() => handlePage(active - 1)}
      />
      {items}
      <Pagination.Next
        disabled={active === howManyPages}
        onClick={() => handlePage(active + 1)}
      />
      <Pagination.Last
        disabled={active === howManyPages}
        onClick={() => handlePage(howManyPages)}
      />
    </Pagination>
    </div>
  );
}

export default MyPagination;