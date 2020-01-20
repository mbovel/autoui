import { useModel } from "../../..";
import ReactDOM from "react-dom";

function App() {
	const store = useAutomergeStore(initialState)
	useJsonSchema()
	return <form></form>
}

ReactDOM.render(<App />, document.querySelector("#app"));