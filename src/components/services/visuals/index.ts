import PipelineVis from './PipelineVis.astro';
import AgentFlow from './AgentFlow.astro';
import RagDiagram from './RagDiagram.astro';
import StrategyCanvas from './StrategyCanvas.astro';
import AzureArch from './AzureArch.astro';
import DataPipeline from './DataPipeline.astro';
import MlCycle from './MlCycle.astro';
import IotEdge from './IotEdge.astro';

export const visualMap = {
  pipeline: PipelineVis,
  agent: AgentFlow,
  rag: RagDiagram,
  strategy: StrategyCanvas,
  azure: AzureArch,
  data: DataPipeline,
  ml: MlCycle,
  iot: IotEdge,
} as const;

export type VisualKey = keyof typeof visualMap;
