import React from "react";

function Loading(props) {
  return (
    <>
    {
      props.loading ? <div className="loader" >loading </div>  : props.children
      // props.loading ? <div className="loader" >loading </div>  : <div>done</div>
    }
    </>
  )
}

export default Loading