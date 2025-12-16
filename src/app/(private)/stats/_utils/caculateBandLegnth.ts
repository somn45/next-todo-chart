import { ITodo } from "@/types/schema";

interface TimeBasedLinearScale {
  x_scale: d3.ScaleTime<number, number, never>;
}

interface GraphDomain {
  domainStart: Date;
  domainEnd: Date;
}

// x 축이 시간 스케일인 밴드의 길이 계산
const caculateBandLength = (
  data: ITodo,
  graphScale: TimeBasedLinearScale,
  graphDomain: GraphDomain,
) => {
  const { x_scale } = graphScale;
  const { domainStart, domainEnd } = graphDomain;
  let bandEndPoint;
  if (!data.completedAt) {
    bandEndPoint = x_scale(new Date(Date.now()));
  } else if (domainEnd.getTime() < new Date(data.completedAt).getTime()) {
    bandEndPoint = x_scale(domainEnd);
  } else {
    bandEndPoint = x_scale(new Date(data.completedAt));
  }
  let bandStartPoint;
  if (domainStart.getTime() > new Date(data.createdAt).getTime()) {
    bandStartPoint = x_scale(domainStart);
  } else {
    bandStartPoint = x_scale(new Date(data.createdAt));
  }
  return bandEndPoint - bandStartPoint;
};

export default caculateBandLength;
