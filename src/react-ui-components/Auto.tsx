import { UIElement, UIType, UIElementFromType } from "../ui/ui";
import { ComponentType, memo, createContext } from "react";
import { defaultComponents } from "./default/index";
import * as React from "react";

export const ThemeContext: React.Context<ComponentsMap> = createContext(defaultComponents);

export type ComponentsMap = {
	[K in UIType]: ComponentType<UIElementFromType<K>>;
};

export const Auto = memo(({ ui, theme }: { ui: UIElement; theme?: ComponentsMap }) => {
	console.log("React", ui);
	if (theme) {
		const C = theme[ui.type] as ComponentType<UIElement>;
		return (
			<ThemeContext.Provider value={theme}>
				<C {...ui} />
			</ThemeContext.Provider>
		);
	}
	const C = React.useContext(ThemeContext)[ui.type] as ComponentType<UIElement>;
	return <C {...ui} />;
});
