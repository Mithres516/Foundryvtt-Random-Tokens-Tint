# Foundryvtt-Random-Tokens-Tint
A module for Foundry VTT to apply a random Tint from a configurable list on a token when placing it.

Before placing a token, enable in the Prototype Token (top right in the Sheet) Random Tokens Tint -> Randomize Color.
Update the prototype token.

Place your token, it will have a random tint assigned from the list.

Configurations:
* Active: enable or disable the module.
* Avoid Repetition: 
	*checked: will not use the same color twice, until all the colors are used.
	*unchecked: will select a random color form the whole list.
* Setup Colors: the list of colors to use, you can place multiple times the same color to increase his chance and allow it to be repeated a certain amount of times with Avoid Repetition checked.

The module also contains 2 macros to randomize the tint of the selected tokens, one for all tokens, the other only for the tokens with Randomize Color checked.