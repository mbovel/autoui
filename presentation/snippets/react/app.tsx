import React from "react";
import ReactDOM from "react-dom";

const h = React.createElement;

function MyForm({ name }: Props) {
	return <div>{"Hello " + name.toLocaleUpperCase()}</div>;
}

ReactDOM.render(MyForm({ name: "Arthur" }), document.querySelector("#app"));

interface Props {
	name: string;
}
