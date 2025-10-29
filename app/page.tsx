export default function HomePage() {
  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-5xl font-heading font-bold text-foreground">
          Anna Turbina Tours
        </h1>
        
        <p className="text-lg font-sans text-foreground">
          Тестовая строка для проверки дизайн-системы
        </p>
        
        <div className="space-y-4">
          <h2 className="text-3xl font-heading font-bold text-primary">
            Цветовая палитра
          </h2>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-background p-4 rounded-lg border border-muted">
              <p className="text-sm text-muted-foreground">Background</p>
              <p className="text-foreground">#F9F9F9</p>
            </div>
            
            <div className="bg-primary p-4 rounded-lg">
              <p className="text-white">Primary</p>
              <p className="text-white">#BEA692</p>
            </div>
            
            <div className="bg-muted p-4 rounded-lg">
              <p className="text-muted-foreground">Muted</p>
              <p className="text-foreground">#E5E0DB</p>
            </div>
            
            <div className="bg-foreground p-4 rounded-lg">
              <p className="text-background">Foreground</p>
              <p className="text-background">#1A1A1A</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
