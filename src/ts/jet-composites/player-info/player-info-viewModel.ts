"use strict";

import * as ko from "knockout";
import componentStrings = require("ojL10n!./resources/nls/player-info-strings");
import Context = require("ojs/ojcontext");
import Composite = require("ojs/ojcomposite");
import "ojs/ojknockout";
import 'ojs/ojbutton';
import 'ojs/ojinputtext';
import { Computed, Observable, ObservableArray, Subscription } from 'knockout';

export default class ViewModel implements Composite.ViewModel<Composite.PropertiesType> {
    busyResolve: (() => void);
    composite: Element;
    properties: Composite.PropertiesType;
    res: { [key: string]: string };

    public symbol: 'X' | 'O';
    public name: Observable<string>;
    // public isActive: Observable;
    public isEditing: Observable<boolean> = ko.observable(false);
    public editHandler: () => void = this.edit.bind(this);

    constructor(context: Composite.ViewModelContext<Composite.PropertiesType>) {
        //At the start of your viewModel constructor
        const elementContext: Context = Context.getContext(context.element);
        const busyContext: Context.BusyContext = elementContext.getBusyContext();
        const options = { "description": "Web Component Startup - Waiting for data" };
        this.busyResolve = busyContext.addBusyState(options);

        this.composite = context.element;

        //Example observable
        this.properties = context.properties;
        this.res = componentStrings["player-info"];

        this.symbol = this.properties.symbol;
        this.name = ko.observable(this.properties.name);
        // this.isActive = this.properties.isActive;
        // console.log(this.isActive());

        // Example for parsing context properties
        // if (context.properties.name) {
        //     parse the context properties here
        // }

        //Once all startup and async activities have finished, relocate if there are any async activities
        this.busyResolve();
    }

    public edit(): void {
        if (this.isEditing()) {
            let data = {
                detail: {symbol: this.symbol, name: this.name()},
            }
            this.composite.dispatchEvent(new CustomEvent('nameChange', data));
        }
        this.isEditing(!this.isEditing());
    }

    //Lifecycle methods - implement if necessary

    activated(context: Composite.ViewModelContext<Composite.PropertiesType>): Promise<any> | void {

    };

    connected(context: Composite.ViewModelContext<Composite.PropertiesType>): void {

    };

    bindingsApplied(context: Composite.ViewModelContext<Composite.PropertiesType>): void {

    };

    propertyChanged(context: Composite.PropertyChangedContext<Composite.PropertiesType>): void {

    };

    disconnected(element: Element): void {

    };
};