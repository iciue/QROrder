import React from "react";

function Loading(props) {
  return (
    <>
    {
      props.loading ? <div className="loader" >loading </div>  : props.children
    }
    </>
  )
}

export default Loading