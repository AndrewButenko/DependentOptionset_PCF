import { IInputs, IOutputs } from "./generated/ManifestTypes";

export class DependentOptionset implements ComponentFramework.StandardControl<IInputs, IOutputs> {

    private container: HTMLDivElement;
    private currentValue: number | undefined = undefined;
    private currentParentValue: number | undefined = undefined;
    private notifyOutputChanged: () => void;
    private comboBoxControl: HTMLSelectElement;
    private dependentOptionsetConfiguration: Array<IDependentOptionsetConfiguration>;
    private allOptions: ComponentFramework.PropertyHelper.OptionMetadata[];

    constructor() {

    }

    public init(context: ComponentFramework.Context<IInputs>,
        notifyOutputChanged: () => void,
        state: ComponentFramework.Dictionary,
        container: HTMLDivElement) {
        this.container = container;
        this.notifyOutputChanged = notifyOutputChanged;

        let comboBoxContainer = document.createElement("div");
        comboBoxContainer.className = "select-wrapper";

        this.comboBoxControl = document.createElement("select");
        this.comboBoxControl.className = "dependentOptionset";
        this.comboBoxControl.addEventListener("change", this.onChange.bind(this));
        this.comboBoxControl.addEventListener("mouseenter", this.onMouseEnter.bind(this));
        this.comboBoxControl.addEventListener("mouseleave", this.onMouseLeave.bind(this));

        comboBoxContainer.appendChild(this.comboBoxControl);
        container.appendChild(comboBoxContainer);

        if (context.parameters.value.attributes == null) {
            return;
        }

        this.allOptions = context.parameters.value.attributes.Options;

        this.loadDependentOptionsetConfiguration(context);
    }

    private loadDependentOptionsetConfiguration(context: ComponentFramework.Context<IInputs>) {
        const pathToConfiguration = "/WebResources/" + context.parameters.Configuration.raw;
        let request = new XMLHttpRequest();
        request.open("GET", pathToConfiguration, true);
        request.onreadystatechange = () => {
            if (request.readyState === 4 /* complete */) {
                request.onreadystatechange = null;
                if (request.status === 200) {
                    try {
                        this.dependentOptionsetConfiguration = JSON.parse(request.response);
                        this.renderControl(context);
                    } catch (e) {
                        this.renderError();
                    }
                } else {
                    this.renderError();
                }
            }
        };
        request.send();
    }

    private onChange(): void {
        this.currentValue = this.comboBoxControl.value == undefined ? undefined : parseInt(this.comboBoxControl.value);
        this.notifyOutputChanged();
    }

    private onMouseEnter(): void {
        this.comboBoxControl.className = "dependentOptionsetFocused";
        if (this.comboBoxControl.parentElement != null) {
            this.comboBoxControl.parentElement.className = "select-wrapperFocused";
        }

        if (this.comboBoxControl.options.length !== 0) {
            this.comboBoxControl.options[0].innerHTML = "--Select--";
        }
    }

    private onMouseLeave(): void {
        this.comboBoxControl.className = "dependentOptionset";
        if (this.comboBoxControl.parentElement != null) {
            this.comboBoxControl.parentElement.className = "select-wrapper";
        }

        if (this.comboBoxControl.options.length !== 0) {
            this.comboBoxControl.options[0].innerHTML = "---";
        }
    }

    private renderControl(context: ComponentFramework.Context<IInputs>) {
        if (context.parameters.ParentOptionset == undefined ||
            this.dependentOptionsetConfiguration == undefined) {
            this.comboBoxControl.innerHTML = "";
            return;
        }

        if (this.currentParentValue === context.parameters.ParentOptionset.raw &&
            this.currentValue === context.parameters.value.raw) {
            return;
        }

        this.currentValue = context.parameters.value.raw;
        let valueWasChanged = true;
        this.currentParentValue = context.parameters.ParentOptionset.raw;
        this.comboBoxControl.innerHTML = "";

        let option: HTMLOptionElement = document.createElement("option");
        option.innerHTML = "---";
        this.comboBoxControl.add(option);

        if (this.currentParentValue == null) {
            return;
        }

        let configuration: IDependentOptionsetConfiguration | null = null;

        for (let i = 0; i < this.dependentOptionsetConfiguration.length; i++) {
            if (this.currentParentValue === this.dependentOptionsetConfiguration[i].parentOption) {
                configuration = this.dependentOptionsetConfiguration[i];
                break;
            }
        }

        if (configuration == null) {
            return;
        }

        for (let i = 0; i < configuration.childOptions.length; i++) {
            for (let j = 0; j < this.allOptions.length; j++) {
                if (configuration.childOptions[i] === this.allOptions[j].Value) {
                    option = document.createElement("option");
                    option.innerHTML = this.allOptions[j].Label;
                    option.value = this.allOptions[j].Value.toString();

                    if (this.currentValue != null &&
                        this.currentValue === this.allOptions[j].Value) {
                        option.selected = true;
                        valueWasChanged = false;
                    }

                    this.comboBoxControl.add(option);
                }
            }
        }

        if (valueWasChanged) {
            this.currentValue = undefined;
            this.notifyOutputChanged();
        }
    }

    private renderError() {
        this.container.innerHTML = "Error loading dependency configuration";
    }

    public updateView(context: ComponentFramework.Context<IInputs>): void {
        this.renderControl(context);
    }

    public getOutputs(): IOutputs {
        const result = {
            value: this.currentValue,
        };

        return result;
    }

    public destroy(): void {
        // Add code to cleanup control if necessary
    }
}

interface IDependentOptionsetConfiguration {
    parentOption: number;
    childOptions: Array<number>;
}