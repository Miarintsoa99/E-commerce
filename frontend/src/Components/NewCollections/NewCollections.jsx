import React, { useEffect, useState } from "react";
import "./NewCollections.css";
import Item from "../Item/Item";

const NewCollections = () => { 
  
  const [new_collection,setNewcollection] = useState([]);

  useEffect(() =>{
     fetch('http://localhost:4000/newcollections')
     .then((response)=> response.json())
     .then((data) =>setNewcollection(data));
  },[])

  return (
    <div className="new-collections">
      <h1>NEW COLLECTIONS</h1>
      <hr />
      <div className="collections">
        {new_collection.map((item, i) => {
          return <Item key={i} {...item} />;
        })}
      </div>
    </div>
  );
};

export default NewCollections;
