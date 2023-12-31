import React, {useEffect} from "react"
import BenefitView from "./BenefitView";
import InfiniteScroll from 'react-infinite-scroller';
import {IBenefit} from "./Benefit";
import {useRecoilState} from "recoil";
import {provinceState} from "../global-state/province";

interface BenefitContainerProps {
    infinite: boolean
}

interface BenefitState {
    benefits: IBenefit[]
    hasMore: boolean
}

const BenefitContainer: React.FC<BenefitContainerProps> = ({infinite}) => {
    const [state, setState] = React.useState<BenefitState>({benefits: [], hasMore: true});
    const [province, setProvince] = useRecoilState(provinceState);

    useEffect(() => {
        fetch(`${process.env.REACT_APP_HOST}/benefits?page=${0}&province=${province}&limit=5`)
            .then((response) => response.json())
            .then((data) => {
                let clone = {...state};
                clone.benefits = data.docs
                clone.hasMore = infinite ? data.hasNextPage : false
                setState(clone)
            });
        },[province])

    const loadFunc = (page: number) => {
        fetch(`${process.env.REACT_APP_HOST}/benefits?page=${page}&province=${province}&limit=5`)
            .then((response) => response.json())
            .then((data) => {
                let clone = {...state};
                clone.benefits = clone.benefits.concat(data.docs)
                clone.hasMore = infinite ? data.hasNextPage : false
                setState(clone)
            });
    }

    return (
        <main style={{overflow: "auto", height: "100%"}}>
            <InfiniteScroll style={{overflow: "auto"}}
                            pageStart={0}
                            loadMore={loadFunc}
                            hasMore={state.hasMore}
                            loader={<div className="loader" key={0}>Loading ...</div>}
                            useWindow={false}
                            initialLoad={true}
            >
                <BenefitView benefits={state.benefits} province={province}/>
            </InfiniteScroll>
        </main>
    );
};

export default BenefitContainer;
