import { useEffect, useState } from "react";
import "./App.css";
import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";
import { useAppStore } from "./store";
import { Button , Input } from 'antd';
import { EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';




const EditModal = () => {
  const { open, setOpen, title, description,price, setTitle, setDescription,setPrice, id } = useAppStore();
  const [loading, setLoading] = useState(false);

  const handleSave = () => {
    setLoading(true);
    fetch(`https://dummyjson.com/products/${id}`, {
      method: "PUT" /* or PATCH */,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        price,
      }),
    })
      .then((res) => res.json())
      // eslint-disable-next-line no-unused-vars
      .then((data) => {
        setLoading(false);
        setOpen(false)
        alert(`${id} is updated`);
      });
  };

  return (
    <Modal open={open} onClose={() => setOpen(false)} center>
      <div className="edit-product">
        <h2>Edit Product</h2>
        <div className="form-group">
          <label>Product Name</label>
          <input placeholder="Title" value={title}
            onChange={(e) => setTitle(e.target.value)}/>
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea placeholder="Description" value={description}
            onChange={(e) => setDescription(e.target.value)}/>
        </div>

        <div className="form-group">
          <label>Product Price</label>
          <input placeholder="Price" value={price}
            onChange={(e) => setPrice(e.target.value)}/>
        </div>
        <br />
        <button className="save" onClick={() => handleSave()}>{loading ? "Loading..." : "Save"}</button>
        <button className="Cancel" onClick={() => setOpen(false)}>Cancel</button>
      </div>
    </Modal>
  );
};


function App() {
  const [products, setProducts] = useState([]);
  const { setOpen, setTitle, setPrice, setID } = useAppStore();

  const [showFullDescription, setShowFullDescription] = useState(false);
  const [isNewProductModalOpen, setNewProductModalOpen,handleSaveNewProduct] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searching, setSearching] = useState(false);

  const loadProducts = async () => {
    // fetch("https://dummyjson.com/products")
    //   .then((res) => res.json())
    //   .then((data) => {
    //     console.log(data);
    //   });

    try {
      let resp = await fetch("https://dummyjson.com/products");
      let data = await resp.json();
      setProducts(data.products);
    } catch (error) {
      console.log(error);
    }
  };

  // eslint-disable-next-line no-unused-vars
  const deleteProduct = async (productID) => {
    // fetch(`https://dummyjson.com/products/${productID}`, {
    //   method: "DELETE",
    // })
    //   .then((res) => res.json())
    //   .then((data) => {
    //     if (data.isDeleted === true) {
    //       alert("Delete Successfull!");
    //     }
    //   });

    try {
      let resp = await fetch(`https://dummyjson.com/products/${productID}`, {
        method: "DELETE",
      });
      let data = await resp.json();
      if (data.isDeleted === true) {
        alert(`${productID} is Deleted`);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // eslint-disable-next-line no-unused-vars
  const findProduct = () => {
    const foundProduct = products.find((product) =>
      product.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (foundProduct) {
      setOpen(true);
      setID(foundProduct.id);
      setTitle(foundProduct.title);
      setPrice(foundProduct.price);
      setSearching(true);
    } else {
      alert("Product not found!");
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  return (
    <div>

        <div className="navbar">
          <div className="dashboard">Dashboard</div>
          <img src="src/assets/react.svg" alt="Logo" />
          <div className="admin">Admin</div>
        </div>
        <div className="container">
          <div className="button-group">
          
            <div className="search-bar" style={{marginTop: '30px'}}>
            <Input placeholder="Find Product" value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              prefix={<SearchOutlined style={{ color: 'gray',fontSize:'22px'}} />}
              style={{ width: '150%', height:'40px', borderRadius: '25px',fontWeight:'bold'}}
            />
            </div>
            <button className="new-product" onClick={() => setNewProductModalOpen(true)}>+ New Product</button>

          </div>
    
          {/* <ul>
            {products.map((el) => (
              <li>{el.title}</li>
            ))}
          </ul> */}
          <table>
            <thead style={{ background: "#ccc" }}>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Description</th>
                <th>Price</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {/* {products.map((el, i) => ( */}
              {products.slice(0, searching ? products.length : 2).map((el, i) => (
                <tr key={i}>
                  <td>{el.id}</td>
                  <td>{el.title}</td>
                  <td>
                  {showFullDescription ? (
                    el.description
                  ) : (
                    <>
                      {el.description.slice(0, 40)}{" "}
                      {el.description.length > 40 && (
                        <span
                          style={{ color: "black", cursor: "pointer" }}
                          onClick={() => setShowFullDescription(true)}
                        >
                          ...
                        </span>
                      )}
                    </>
                  )}
                </td>
                  <td>{el.price}</td>
                  <td>
                  <Button
                    type="primary" icon={<EditOutlined />}
                    style={{ background: "black", color: "white" }}
                    onClick={() => {setOpen(true);setID(el.id);
                    setTitle(el.title);setPrice(el.price);}}>
                  </Button>
                  <Button
                    type="primary" icon={<DeleteOutlined />}
                    style={{ background: "red", color: "white" }}
                    onClick={() => {setOpen(true);setID(el.id);
                    setTitle(el.title);setPrice(el.price);}}>
                  </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <EditModal />

           {/* لإضافة منتج جديد */}
        <Modal open={isNewProductModalOpen} onClose={() => setNewProductModalOpen(false)} center>
          <div className="add-product">
            <h2>Add New Product</h2>
            <div className="form-group">
              <label>Product Name</label>
              <input placeholder="Title" />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea placeholder="Description" />
            </div>
            <div className="form-group">
              <label>Product Price</label>
              <input placeholder="Price" />
            </div>
            <br />
            <button className="save" onClick={() => handleSaveNewProduct()}>Save</button>
            <button className="cancel" onClick={() => setNewProductModalOpen(false)}>Cancel</button>
          </div>
        </Modal>

        </div>

    </div>
  );
}

export default App;
