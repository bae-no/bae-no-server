import { T, OT, M, L } from '@app/custom/effect';
import { pipe } from '@effect-ts/core';
import { identity } from '@effect-ts/core/Function';
import { diag, DiagConsoleLogger, DiagLogLevel } from '@opentelemetry/api';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { W3CTraceContextPropagator } from '@opentelemetry/core';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { registerInstrumentations } from '@opentelemetry/instrumentation';
import { Resource } from '@opentelemetry/resources';
import { BatchSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { NodeTracerProvider } from '@opentelemetry/sdk-trace-node';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';

export const initTelemetry = (config: {
  appName: string;
  telemetryUrl: string;
}): NodeTracerProvider => {
  // Set an internal logger for open telemetry to report any issues to your console/stdout
  diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.WARN);

  // create an exporter to an open telemetry exporter. We create this collector instance locally using docker compose.
  const exporter = new OTLPTraceExporter({
    url: config.telemetryUrl, // e.g. "http://otel-collector:4318/v1/traces",
    timeoutMillis: 15000,
    concurrencyLimit: 10, // an optional limit on pending requests
  });

  // We add some common meta data to every trace. The service name is important.
  const resource = Resource.default().merge(
    new Resource({
      [SemanticResourceAttributes.SERVICE_NAME]: config.appName,
      application: config.appName,
    }),
  );

  // We use the node trace provider provided by open telemetry
  const provider = new NodeTracerProvider({ resource });

  // The batch span provider is more efficient than the basic provider. This will batch sends to
  // the exporter you have configured
  provider.addSpanProcessor(
    new BatchSpanProcessor(exporter, {
      // The maximum queue size. After the size is reached spans are dropped.
      maxQueueSize: 2048,
      // The maximum batch size of every export. It must be smaller or equal to maxQueueSize.
      maxExportBatchSize: 512,
      // The interval between two consecutive exports
      scheduledDelayMillis: 5000,
      // How long the export can run before it is cancelled
      exportTimeoutMillis: 30000,
    }),
  );

  // Initialize the propagator
  provider.register({
    propagator: new W3CTraceContextPropagator(),
  });

  // Registering instrumentations / plugins
  registerInstrumentations({
    instrumentations: getNodeAutoInstrumentations(),
  });

  return provider;
};

const makeNodeTracingProvider = (tracerProvider: NodeTracerProvider) =>
  M.gen(function* () {
    return identity<OT.TracerProvider>({
      [OT.TracerProviderSymbol]: OT.TracerProviderSymbol,
      tracerProvider,
    });
  });

export const NodeProviderLayer = (provider: NodeTracerProvider) =>
  L.fromManaged(OT.TracerProvider)(makeNodeTracingProvider(provider));

const dummyProps = {} as any;
export const DummyTracing = OT.Tracer.has({
  [OT.TracerSymbol]: OT.TracerSymbol,
  tracer: {
    startSpan: () => ({
      setAttribute: () => null,
      setStatus: () => null,
      end: () => null,
    }),
    ...dummyProps,
  },
});

export const liveTracer = process.env.OTLP_TRACE
  ? pipe(
      initTelemetry({
        appName: 'bae-no-server',
        telemetryUrl: 'http://localhost:4318/v1/traces',
      }),
      (provider) =>
        T.provideSomeLayer(OT.LiveTracer['<<<'](NodeProviderLayer(provider))),
    )
  : T.provide(DummyTracing);
