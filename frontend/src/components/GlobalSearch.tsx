import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, UserCheck, Loader2 } from "lucide-react";
import { usePatientContext } from "@/context/PatientContext";

const GlobalSearch: React.FC = () => {
  const { searchPatientByPhn, patient, isSearching } = usePatientContext();
  const [searchPhn, setSearchPhn] = useState("");
  const [localSearching, setLocalSearching] = useState(false);

  const handleSearch = async () => {
    if (searchPhn.trim()) {
      console.log('GlobalSearch: click search', searchPhn);
      setLocalSearching(true);
      try {
        await searchPatientByPhn(searchPhn.trim());
        console.log('GlobalSearch: searchPatientByPhn returned');
      } catch (error) {
        // Error is already handled in the context
        console.log('GlobalSearch: search completed with error', error);
      } finally {
        setLocalSearching(false);
      }
    }
  };

  const isLoading = isSearching || localSearching;

  return (
    <div className="flex items-center gap-2">
      <div className="relative flex-1">
        <Input
          id="globalSearchPhn"
          value={searchPhn}
          onChange={(e) => setSearchPhn(e.target.value)}
          placeholder="Search patient by PHN..."
          className="h-10 border-2 border-gray-200 focus:border-blue-500 pr-10"
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleSearch();
            }
          }}
          disabled={isLoading}
        />
        {isLoading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
          </div>
        )}
      </div>
      
      <Button
        type="button"
        onClick={handleSearch}
        disabled={isLoading || !searchPhn.trim()}
        className="h-10 bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 disabled:opacity-50 min-w-[120px]"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Searching...
          </>
        ) : (
          <>
            <Search className="w-4 h-4" />
            Search
          </>
        )}
      </Button>
      
      {/* Patient Found Indicator */}
      {patient?.phn && (
        <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 px-3 py-1 rounded-full">
          <UserCheck className="w-4 h-4" />
          <span>Patient Found: {patient.name}</span>
        </div>
      )}
    </div>
  );
};

export default GlobalSearch;