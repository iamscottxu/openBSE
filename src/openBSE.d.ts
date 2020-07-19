declare module "openBSE" {
    interface generalOptions {
        verticalInterval?: number;
        playSpeed?: number;
        clock?: clockCallback;
        scaling?: number;
        defaultStyle?: GeneralBulletScreenStyle;
        hiddenTypes?: GeneralType;
        opacity?: number;
        cursorOnMouseOver?: string;
    }

    type clockCallback = () => number;

    interface GeneralBulletScreen {
        text: string;
        canDiscard: boolean;
        startTime: number;
        type?: GeneralType;
        style?: GeneralBulletScreenStyle;
        layer?: number;
        [propName: string]: any;
    }

    interface GeneralBulletScreenStyle {
        shadowBlur?: number;
        fontWeight?: string | number;
        fontFamily?: string;
        size?: number;
        boxColor?: string;
        color?: string;
        borderColor?: string;
        speed?: number;
        residenceTime?: number;
    }

    interface GeneralBulletScreenEvent {
        getBulletScreen(): GeneralBulletScreen;
        setBulletScreen(bulletScreen: GeneralBulletScreen, redraw?: boolean): void;
        getPlayState(): boolean;
        setPlayState(play: boolean): void;
        readonly type: string;
        readonly screenX: number;
        readonly screenY: number;
        readonly clientX: number;
        readonly clientY: number;
        readonly pageX: number;
        readonly pageY: number;
    }

    interface DebugInfo {
        time: number;
        realTimeBulletScreenCount: number;
        bufferBulletScreenCount: number;
        delay: number;
        delayBulletScreenCount: number;
        fps: number;
    }

    interface VersionInfo {
        version: string;
        home: string;
        name: string;
        description: string;
    }

    export class GeneralEngine {
        constructor(element: Element, options?: generalOptions, 
            renderMode?: ['canvas' | 'css3' | 'webgl' | 'svg']);
        visibility: boolean;
        readonly renderMode: ['canvas' | 'css3' | 'webgl' | 'svg'];
        readonly playState: boolean;
        readonly debugInfo: DebugInfo;
        bind(name: ['click' | 'contextmenu' | 'mouseleave' | 'mouseenter'], fun: (e: GeneralBulletScreenEvent) => boolean): void;
        unbind(name: ['click' | 'contextmenu' | 'mouseleave' | 'mouseenter'], fun: (e: GeneralBulletScreenEvent) => boolean): void;
        add(bulletScreen: GeneralBulletScreen): void;
        play(): void;
        playAllBulletScreens(): void;
        pause(): void;
        cleanBuffer(): void;
        cleanScreen(): void;
        stop(): void;
    }

    export class BrowserNotSupportError extends Error {
        constructor(message: string);
    }

    export enum GeneralType {
        rightToLeft = 1,
        leftToRight = 2,
        top = 4,
        bottom = 8
    }

    export class Contextmenu {
        constructor(generalEngine, element: Element, layer?: number, pause?: boolean);
    }

    export function getVersion() : VersionInfo;
}
