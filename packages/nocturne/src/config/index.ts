export type NocturneConfig = Record<string, unknown>

export function defineNocturneConfig<TConfig extends NocturneConfig>(config: TConfig): TConfig {
  return config
}
