import {Badge} from "@material-ui/core";
import {img_300, unavailable} from "../../config/config";
import ContentModal from "../../contentModal/ContentModal";
import "./singe.scss";

export default function SingeContext({content}) {
    const {
        id,
        poster_path,
        progress,
        bitcoin_price_at,
        title
    } = content;

    return (
        <ContentModal id={id} content={content}>
            <Badge
                badgeContent={progress}
                color={progress > 70.0 ? "primary" : "secondary"}
            />
            <img
                className="poster"
                src={`photos/${poster_path}` || unavailable}
                alt={title}
            />
            <b className="title">{title}</b>
            <div className="subTitle">
                <span>{"₿ at:"}</span>
                <span>{bitcoin_price_at}</span>
            </div>
        </ContentModal>
    );
}
