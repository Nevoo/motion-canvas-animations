import {
    Img,
    Layout,
    LayoutProps,
    Node,
    Rect,
    RectProps,
    initial,
    signal,
} from "@motion-canvas/2d";
import {
    PossibleVector2,
    SignalGenerator,
    SignalValue,
    SimpleSignal,
    ThreadGenerator,
    Vector2,
    Vector2Signal,
    all,
    createSignal,
    makeRef,
    map,
    range,
    sequence,
    useLogger,
} from "@motion-canvas/core";
import { Colors } from "../../styles";

export interface OrbitImagesProps extends LayoutProps {
    initilaScale?: SignalValue<number>;
    displayImages?: SignalValue<boolean>;
}

export class OrbitImages extends Node {
    logger = useLogger();

    // @initial(0)
    // @signal()
    // public declare readonly initialScale: SimpleSignal<number, this>;

    @initial(false)
    @signal()
    public declare readonly displayImages: SimpleSignal<boolean, this>;

    public imageCount = createSignal(1);

    // private imageScales: number[];
    public readonly rects: ImageCard[] = [];

    public constructor(props?: OrbitImagesProps) {
        super({ ...props });

        this.add(
            <Layout>
                {() =>
                    range(this.imageCount()).map((value, i) => {
                        return (
                            <ImageCard index={i} ref={makeRef(this.rects, i)} />
                        );
                    })
                }
            </Layout>
        );
    }

    public *scaleImages(scale: number, duration?: number) {
        yield* all(
            ...this.rects.map((rect, i) => {
                return rect.image.scale(scale, duration);
            })
        );
    }

    public *sequenceScaleImages(
        scale: number,
        duration?: number,
        sequenceTime?: number
    ) {
        yield* sequence(sequenceTime ?? 0.1, this.scaleImages(scale, duration));
    }

    public calcXPos(i: number): number {
        return Math.sin((i / this.imageCount()) * Math.PI * 2) * 200;
    }

    public calcYPos(i: number): number {
        return Math.cos((i / this.imageCount()) * Math.PI * 2) * 200;
    }

    public calcRotation(i: number): number {
        const x = this.calcXPos(i);
        const y = this.calcYPos(i);

        let angle = Math.atan2(y, x);
        angle -= Math.PI / 2;

        return angle; // Return the angle in radians
    }
}

export interface ImgCardProps extends RectProps {
    index: number;
    initialScale?: SignalValue<number>;
    src?: SignalValue<string | null>;
}

export class ImageCard extends Node {
    logger = useLogger();

    @initial(1)
    @signal()
    public declare readonly initialScale: SimpleSignal<number, this>;

    private declare readonly index: number;

    @initial(null)
    @signal()
    public declare readonly src: SimpleSignal<string | null, this>;

    public readonly image: Img;

    public constructor(props?: ImgCardProps) {
        super({ ...props });

        this.index = props.index;

        this.add(
            <Img
                src={() => this.src()}
                scale={() => this.initialScale()}
                ref={makeRef(this, "image")}
                width={100}
                height={100}
                fill={this.index === 0 ? Colors.MAIN : Colors.SECONDARY}
                radius={8}
            />
        );

        // this.image.position(() => {
        //     const scale = this.image?.scale().x ?? 1;
        //     const width = this.image?.width() ?? 100;

        //     return [
        //         -(width * scale * 2 + 50) + (scale * 100 + 25) * this.index,
        //         0,
        //     ];
        // });

        // this.image.scale(() => {
        //     this.initialScale(() => this.image.scale().x);

        //     return this.initialScale();
        // });
    }

    protected draw(context: CanvasRenderingContext2D) {
        super.draw(context);
    }
}
